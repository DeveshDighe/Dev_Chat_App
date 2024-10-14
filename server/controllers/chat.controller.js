
const { ALERT, REFETCH_CHATS, NEW_ATTACHMENT, NEW_MESSAGE_ALERT, NEW_MESSAGE, REFETCH_GROUP_DETAIL, ADDED_IN_GROUP } = require('../constants/events.js');
const { getOtherMember } = require('../lib/helper.js');
const Chat = require('../models/chat.js');
const User = require('../models/user.js');
const Message = require('../models/message.js');
const { emitEvent, deleteFilesFromClodinary, uploadFilesToClodinary } = require('../utils/features.js');

const newGroupChat = async (req, res) => {
  try {
    const { groupName, members } = req.body;

    // Ensure members is a valid JSON string
    let parsedMembers;
    try {
      parsedMembers = JSON.parse(members);
    } catch (error) {
      throw new Error('Invalid members format. Please provide a valid JSON string.');
    }

    if (parsedMembers.length < 2) {
      throw new Error('Group must have a minimum of 3 members.');
    }

    const file = req.file;

    // Check if the file is uploaded
    if (!file) {
      throw new Error('Please upload an avatar.');
    }

    // Upload the file to Cloudinary
    const result = await uploadFilesToClodinary([file], 'group_img');

    const avatar = {
      url: result[0]?.url || 'https://media.istockphoto.com/id/1076599848/vector/meeting-isolated-on-white-background-vector-illustration.jpg?s=612x612&w=0&k=20&c=mfidH45AsCS5QXk-80LCy-XRgoedzQgz8H0FinRZlog='
    };

    // Add the creator's ID to the members array
    parsedMembers.push(req.userID);

    // Create the group chat
    await Chat.create({
      name: groupName,
      groupImg: avatar.url,
      groupChat: true,
      creator: req.userID,
      admin: [req.userID],
      members: parsedMembers,
      groupImgPublicId : result[0]?.public_id , 
    });

    // emitEvent(req, ALERT, parsedMembers, `Welcome to ${groupName} group`);
    emitEvent(req, REFETCH_CHATS, parsedMembers);

    res.status(201).json({ status: 'success', message: 'Group created' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
}


const getMyChat = async (req, res) => {
  const searchTerm = req.query.search;
  let filter = req.query.filter;

  let chats;

  try {
    
    if (searchTerm || (filter === 'Groups' || filter === 'Chats')) {
      
      let groupChat;
      if (filter === 'Groups' || filter === 'All') {
        groupChat = true;
      } else {
        groupChat = false;
      }
      
      if (filter === "All") {
        chats = await Chat.find({ members: req.userID, 'name': { $regex: searchTerm, $options: 'i' }})
        .populate('members', 'name avatar status')
        .populate({
          path: 'latestMessage',
          populate: {
            path: 'sender',
            select: 'name', // Adjust fields based on your User schema
          },
        }).sort({ latestMessageTime: -1 });

      }
      else{
        chats = await Chat.find({ members: req.userID, 'name': { $regex: searchTerm, $options: 'i' }, groupChat: groupChat })
        .populate('members', 'name avatar status')
        .populate({
          path: 'latestMessage',
          populate: {
            path: 'sender',
            select: 'name', // Adjust fields based on your User schema
          },
        }).sort({ latestMessageTime: -1 });

      }
     
        
      //populate only name  and avatar
    } else {

      chats = await Chat.find({ members: req.userID })
        .populate('members', 'name avatar status')
        .populate({
          path: 'latestMessage',
          populate: {
            path: 'sender',
            select: 'name', // Adjust fields based on your User schema
          },
        }).sort({ latestMessageTime: -1 });;

      //populate only name  and avatar
    }

    let allChats = [];

    for (let chat of chats) {
      if (!chat.groupChat) { //One on one chat
        let otherMember = await getOtherMember(chat.members, req.userID);

        let chatObject = {
          ...chat.toObject(),  // Convert Mongoose document to plain JavaScript object
          avatar: otherMember?.avatar?.url,  // Add the avatar field
          name: otherMember?.name,
          members: otherMember,  // Replace members with only the other member
        };

        allChats.push(chatObject);
      }
      else {  //group chat
        chat.members = chat.members.filter((member) => {
          if (member._id.toString() === req.userID) {
            // here i dont want to send the person id how is requsting the chats
          } else {
            return member._id;
          }
        }).map((member) => member._id);     //getting only id of each member

        allChats.push(chat);
      }
    }

    // allChats.members.filter((member) => {
    //   if (member._id === req.userID) {

    //   }else{
    //     return member._id
    //   }
    // })
    // console.log(allChats, 'Theese are all chats');


    res.status(200).json({ status: 'success', message: 'All chats fetched', chats: allChats })

  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });

  }
}

const getMyGroup = async (req, res) => {
  try {
    const groups = await Chat.find({ members: req.userID, groupChat: true }).populate('members', 'name avatar');  //populate only name  and avatar

    let allGroups = [];


    for (let group of groups) {
      group.members = group.members.filter((member) => {
        if (member._id.toString() === req.userID) {
          // here i dont want to send the person id how is requsting the chats
        } else {
          return member._id;
        }
      }).map((member) => member._id);

      allGroups.push(group);
    }

    res.status(200).json({ status: 'success', message: 'All groups fetched', groups: allGroups })

  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
}

const addMembers = async (req, res) => {
  try {

    const { chatID, members } = req.body;


    const chat = await Chat.findById(chatID);

    let alreadyAddedMembers = [];
    let userAdded = false;

    if (!chat) {
      throw new Error('Chat not found')
    }

    if (!chat.groupChat) {
      throw new Error('Not a group')
    }


    if (!members || members.length < 1) {
      throw new Error('Please provide members')
    }
    if (!chat.groupChat) {
      throw new Error('This is not a group chat')
    }

    if (chat.creator.toString() !== req.userID.toString()) {
      throw new Error('You are not a admin of group')
    }

    const allNewMembersPromise = members.map((i) => User.findById(i, "name"));


    const allNewMembers = await Promise.all(allNewMembersPromise);


    for (NewMember of allNewMembers) {
      if (!chat.members.includes(NewMember._id)) {
        chat.members.push(NewMember._id);
        userAdded = true;
      }
      else {
        alreadyAddedMembers.push(NewMember.name);
        // throw new Error(`Member ${}is already added`)
      }
    }

    await chat.save();

    const allUsersName = allNewMembers.map((i) => i.name).join(',');

    emitEvent(req, ADDED_IN_GROUP, chat.members, `${allUsersName} has been added in the group`);
    emitEvent(req, REFETCH_CHATS, chat.members);


    if (alreadyAddedMembers.length > 0 && userAdded) {
      const errorMessage = `${alreadyAddedMembers.join(',')} are already in the group`
      res.status(200).json({ status: 'success', message: 'Members added successfully', chat, error: errorMessage })
      return
    }

    if (alreadyAddedMembers.length > 0) {
      //  res.status(200).json({status : 'success', message : 'Members added successfully', chat , error})
      throw new Error(`Member ${alreadyAddedMembers.join(',')} is already in a group`)
    }

    res.status(200).json({ status: 'success', message: 'Members added successfully', chat })

  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
}

const removeMember = async (req, res) => {
  try {
    const { chatID, userToRemoveID } = req.body;

    const chat = await Chat.findById(chatID);
    const user = await User.findById(userToRemoveID);


    if (!userToRemoveID) {
      throw new Error('Please provide member to remove')
    }
    if (!chat.groupChat) {
      throw new Error('Not a group')
    }

    if (chat.members.length < 4) {
      throw new Error('Group must have minimum 3 members')
    }

    const updatedChat = chat.members.filter((member) => {
      return member.toString() !== userToRemoveID
    });

    emitEvent(req, ADDED_IN_GROUP, chat.members, `${user.name} has removed by admin`);
    emitEvent(req, REFETCH_CHATS, chat.members);

    chat.members = updatedChat;
    await chat.save();



    res.status(201).json({ status: 'success', message: 'Member successfully removed', updatedChat });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
}

const leaveGroup = async (req, res) => {
  try {

    const chatID = req.params.id;
    const chat = await Chat.findById(chatID);


    if (!chat) {
      throw new Error('Chat not found');
    }

    if (!chat.groupChat) {
      throw new Error('Not a group')
    }

    if (chat.members.length < 4) {
      throw new Error('Group must have minimum 3 members')
    }

    //getting members exept me
    const remainingMember = chat.members.filter((member) => {
      return member.toString() !== req.userID.toString();
    });


    if (chat.creator.toString() === req.userID.toString()) {

      const randomNumber = Math.floor(Math.random() * remainingMember.length);
      const newCreator = remainingMember[randomNumber];

      chat.creator = newCreator;
    }

    const user = await User.findById(req.userID, 'name'); //To get only name

    chat.members = remainingMember;
    await chat.save();

    emitEvent(req, REFETCH_GROUP_DETAIL, chat.members, `User ${user.name} has left the group`);

    res.status(200).json({ status: 'success', message: 'Removed group successfully' });

  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
}

const sendAttachments = async (req, res) => {
  try {

    const { chatID, content } = req.body;

    const chat = await Chat.findById(chatID);
    const user = await User.findById(req.userID, 'name avatar');

    if (!chat) {
      throw new Error('Chat not found')
    }
    if (!user) {
      throw new Error('User not found')
    }

    const files = req.files || [];

    if (!files || files.length < 1) {
      throw new Error('Please provide a attachment');
    }

    if (files > 5) {
      throw new Error('Files must be lesser than 6');
    }

    // Upload files here
    let fileType;



    const result = await uploadFilesToClodinary(files, 'all attachments');

    const attachments = result;



    const messageForDb = { content: content, attachements: attachments, sender: user._id, chat: chatID };

    const messageForRealTime = {    // pasting all the messageForDb and then making changes in sender
      ...messageForDb,
      sender: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar
      },
    };
 
    const message = await Message.create(messageForDb); //creating new message for db

    emitEvent(req, NEW_MESSAGE, chat.members, {
      message: messageForRealTime,
      chatID
    });
    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, {
      message: messageForRealTime,
      chatID
    });

    res.status(201).json({ status: 'success', message: 'Attachment sent successfully', data: message })
  } catch (error) {

    res.status(500).json({ status: 'error', error: error.message });

  }
}

const getChatDetails = async (req, res) => {
  try {
    const chatID = req.params.id;

    if (req.query.populate === 'true') {

      const chat = await Chat.findById(chatID).populate('members', 'name avatar status').lean();    //Lean makes it a plain javascript object
      
      if (!chat) {
        throw new Error('Chat not found');
      }

      chat.members = chat.members.map(({ _id, name, avatar, status }) => ({
        _id,
        name,
        status,
        avatar: avatar.url
      }));

      return res.status(200).json({ status: 'success', message: 'Chats fetched', data: chat })
    }
    else {
      const chat = await Chat.findById(chatID);


      if (!chat) {
        throw new Error('Chat not found');
      }

      return res.status(200).json({ status: 'success', message: 'Chats fully fetched', data: chat })
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });

  }
}
const getChatDetailsEdit = async (req, res) => {
  try {
    const chatID = req.params.id;

    if (req.query.populate === 'true') {

      const chat = await Chat.findById(chatID).populate('members', 'name avatar status').populate('creator', 'name avatar status').populate('admin', 'name avatar status').lean();    //Lean makes it a plain javascript object

      if (!chat) {
        throw new Error('Chat not found');
      }

      chat.members = chat.members.map(({ _id, name, avatar , status}) => ({
        _id,
        name,
        status,
        avatar: avatar.url
      }));

      return res.status(200).json({ status: 'success', message: 'Chats fetched', data: chat })
    }
    else {

      const chat = await Chat.findById(chatID);


      if (!chat) {
        throw new Error('Chat not found');
      }

      return res.status(200).json({ status: 'success', message: 'Chats fully fetched', data: chat })
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });

  }
}

const renameGroup = async (req, res) => {
  try {
    const chatID = req.params.id;
    const { name } = req.body;

    const chat = await Chat.findById(chatID);

    if (!chat) {
      throw new Error('Chat not found');
    }

    if (!chat.groupChat) {
      throw new Error('This is not a group chat');
    }

    if (chat.creator.toString() !== req.userID.toString()) {
      throw new Error('Only admins can change group name');
    }

    chat.name = name;

    await chat.save();

    emitEvent(req, REFETCH_CHATS, chat.members);

    res.status(200).json({ status: 'Success', message: 'Group name changed' });

  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });

  }
}
const deleteChat = async (req, res) => {        //delete group amd all its messeges
  try {
    const chatID = req.params.id;

    const chat = await Chat.findById(chatID);

    if (!chat) {
      throw new Error('Chat not found');
    }

    if (!chat.groupChat) {
      throw new Error('This is not a group chat');
    }

    const members = chat.members;

    if (chat.groupChat && chat.creator.toString() !== req.userID.toString()) {
      throw new Error('You are not allowed to delete the group');
    };

    if (chat.groupChat && !chat.members.includes(req.userID)) {
      throw new Error('You are not allowed to delete the group');
    }

    //Here we have to delete all messages as well as attachments or files from cloudinary

    const messageWithAttachments = await Message.find({ chat: chatID, attachments: { $exists: true, $ne: [] } });    // getting messages with attachment field should exist there and it should not be empty array

    const public_ids = [];

    messageWithAttachments.forEach((message) => {
      return message.attachment.forEach(({ public_id }) => {  //here destrucuring the public id from attachment
        return public_ids.push(public_id);
      })
    })

    await Promise.all([
      // Delete files from cloudinary
      deleteFilesFromClodinary(public_ids),
      chat.deleteOne(),         //To delete that chat from the db
      Message.deleteMany({ chat: chatID })   //to delete message document which has the chat is chatID
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    res.status(200).json({ status: 'success', message: 'Chat deleted' })
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
}

const getMessages = async (req, res) => {

  try {
    const chatID = req.params.id;

    const chat = await Chat.findById(chatID);

    if (!chat) {
      throw new Error('Chat not found');
    }

    const { page = 1 } = req.query;

    const limit = 20;
    const skip = (page - 1) * limit;



    // Fetch messages and count them in parallel
    const [messages, messagesCount] = await Promise.all([
      Message.find({ chat: chatID })
        .sort({ createdAt: -1 })           // the most recent messages will be listed first.
        // .skip(skip)
        // .limit(limit)
        .populate('sender', "name avatar")
        .lean(),
      Message.countDocuments({ chat: chatID }),
    ]);

    // Determine if there are more messages to load
    const totalPages = Math.ceil(messagesCount / limit);
    const hasMore = page < totalPages;

    res.status(200).json({
      status: 'success',
      message: 'Messages fetched',
      messages: messages.reverse(),
      hasMore: hasMore,    // Include hasMore in the response
    });

  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
}

const changeGroupName = async (req, res) => {
  try {

    const { name } = req.body;
    const groupID = req.params.id;

    if (!groupID) {
      throw new Error('Group id required')
    }
    if (!name) {
      throw new Error('Group name required')
    }

    const group = await Chat.findByIdAndUpdate(groupID, { name: name }, { new: true })
    res.status(200).json({
      status: 'success',
      message: 'Group name updated',
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });

  }
}
const makeAdmin = async (req, res) => {
  try {


    const {groupID, userID} = req.query;

    if (!groupID) {
      throw new Error('Group id required')
    }
    if (!userID) {
      throw new Error('User id required')
    }

    const group = await Chat.findById(groupID);
    if (group.admin.includes(userID)) {
      throw new Error('Already admin')
    }
    
    group.admin = [...group.admin, userID]

    await group.save()
    res.status(200).json({
      status: 'success',
      message: 'Promoted to admin',
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });

  }
}

const removeAdmin = async (req, res) => {
  try {


    const {groupID, userID} = req.query;

    if (!groupID) {
      throw new Error('Group id required')
    }
    if (!userID) {
      throw new Error('User id required')
    }

    const group = await Chat.findById(groupID);
    if (!group.admin.includes(userID)) {
      throw new Error('User is not an admin');
    }

    // Remove the user from the admin list
    group.admin = group.admin.filter(adminID => adminID.toString() !== userID);

    await group.save();

    res.status(200).json({
      status: 'success',
      message: 'Removed from admin',
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });

  }
}


module.exports = {
  newGroupChat,
  getMyChat,
  getMyGroup,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
  getChatDetailsEdit,
  changeGroupName,
  makeAdmin,
  removeAdmin
}