const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const { sendToken, cookieOptions, emitEvent, uploadFilesToClodinary } = require('../utils/features.js');
const Chat = require('../models/chat.js');
const Request = require('../models/request.js');
const { NEW_REQUEST, REFETCH_CHATS } = require('../constants/events.js');
const { getOtherMember } = require('../lib/helper.js');
const cloudinary = require('cloudinary');



const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    const username = name;

    if (!username || !password) {
      throw new Error('Both feilds required')
    }

    const user = await User.findOne({ username }).select('+password');  //select is used to get password because we made password select to false in schema

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      throw new Error('Incorrect password')
    }

    sendToken(res, user, 200, `Welcome ${user.username}`);

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });

  }
}
const createUser = async (req, res) => {
  let result;
  try {

    console.log('Request Body:', req.body);
    console.log('Uploaded File (Avatar):', req.file);

    const { username, name, password, bio } = req.body;

    const file = req.file;
    console.log(file, "This is file");

    if (!req.file) {
      throw new Error('Please upload avatar');
    }

    result = await uploadFilesToClodinary([file], 'profile_pics');

    const avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    }

    const hashhedPass = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      name,
      username,
      password: hashhedPass,
      bio,
      avatar
    })

    // res.status(201).json({message : 'User created', status : 'success'})
    sendToken(res, createdUser, 201, "User created");

  } catch (error) {

    if (error?.errorResponse?.code === 11000) {
      await cloudinary.v2.uploader.destroy(result[0].public_id);
      const alreadyUsedValuesKey = Object.keys(error.keyPattern).join(',')
      error.message = `Add another ${alreadyUsedValuesKey}, its already used`
    }

    res.status(500).json({ status: 'error', message: error.message });

  }
}

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userID); 

    res.status(200).json({ status: 'success', message: 'User found', user })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

const logOut = async (req, res) => {
  try {
    return res.status(200).cookie('UserToken', '', { ...cookieOptions, maxAge: 0 }).json({ status: 'success', message: 'Logout successfully' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

const searchUsers = async (req, res) => {
  console.log(req.userID, 'This is user ID');
  
  try {
    const { name } = req.query;

    // if (!name) {
    //   throw new Error('Please provide name of user');
    // }


    const myChats = await Chat.find({ groupChat: false, members: req.userID });


    //getting my friends and faltting the array;
    const otherUserFromMyChats = myChats.flatMap((chat) => chat.members);

    const friendList = await User.find(({ _id: { $nin: otherUserFromMyChats }, name: { $regex: name, $options: 'i' } })); //getting only those User with whome i did,nt chat and includes the name of body, means getting friends with whome i am not friend

    const removedSelf = friendList.filter((friend)=>{  
      return friend._id.toString() !== req.userID.toString()
    });



    const users = removedSelf.map(({ _id, name, avatar }) => ({    // avatar is a object so making it a string of url
      _id, name,
      avatar: avatar.url
    }));

    res.status(200).json({ status: 'success', message: name, otherUserFromMyChats, users })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });

  }
}


const sendRequest = async (req, res) => {
  try {
    const { userID } = req.body;

    if (!userID) {
      throw new Error('Please provide userID')
    }

    if (userID === req.userID) {
      throw new Error('You can not send requst to self')
    }

    const request = await Request.findOne({ 
      $or: [
        { sender: req.userID, receiver: userID },
        { sender: userID, receiver: req.userID }
      ]
    });     // sender or receiver should not a current user or userID from frontend

    if (request) {
      throw new Error('Request already sent'); 
    }

    const requestData = await Request.create({
      sender: req.userID,
      receiver: userID
    });
    
    const requestToSend = await Request.findById(requestData._id).populate('sender', 'name avatar' ).lean();

    console.log(requestToSend, 'res ers', requestData.sender);
    requestToSend.sender.avatar = requestToSend.sender.avatar.url

    emitEvent(req, NEW_REQUEST, [userID], requestToSend);

    res.status(200).json({ status: 'success', message: 'Friend request has been sent' })

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

const acceptRequest = async (req, res) => {
  try {
    const { requestID, accept } = req.body;

    if (!requestID) {
      throw new Error('Please provide requestID')
    }

    const request = await Request.findById(requestID)
      .populate('sender', 'name')
      .populate('receiver', 'name')
      ;

    if (!request) {
      throw new Error('Invalid request Id');
    }

    if (request.receiver._id.toString() !== req.userID.toString()) {
      throw new Error('You are not authorized to accept this request');
    }

    if (!accept) {
      await request.deleteOne();

      return res.status(200).json({ status: 'success', message: 'Request rejected' })
    }

    const members = [request.sender._id, request.receiver._id]; //creating members of chat sender and receiver

    await Promise.all([
      Chat.create({
        members,
        latestMessage: null,
        name: `${request.sender.name}-${request.receiver.name}`
      }),
      request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members)


    res.status(200).json({ status: 'success', message: 'Friend request accepted', senderId: request.sender._id })

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

const getAllRequests = async (req, res) => {

  try {
    const requests = await Request.find({ receiver: req.userID }).populate("sender", "name avatar");

    const modifiedRequest = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      }
    }));

    res.status(200).json({ status: 'success', data: modifiedRequest })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

const getMyFriends = async (req, res) => {
  try {
    const chatID = req.query.chatID;

    const chats = await Chat.find({
      members: req.userID,
      groupChat: false,
    }).populate("members", "name avatar");

    const friends = chats.map(({ members }) => {
      const otherUser = getOtherMember(members, req.userID);




      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar.url
      }
    })

    if (chatID) {
      const chat = await Chat.findById(chatID);

      //getting only those friends who are not in a chat group. so i can add them.
      const friendsButNotInChatGroup = friends.filter((friend) => {
        return !chat.members.includes(friend._id);
      });

      return res.status(200).json({ status: "success", message: 'all friends fetched', friendsNotInGroup: friendsButNotInChatGroup })
    } else {
      return res.status(200).json({ status: "success", message: 'all friends fetched', friends })
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });

  }
}
module.exports = {
  loginUser,
  createUser,
  getUser,
  logOut,
  searchUsers,
  sendRequest,
  acceptRequest,
  getAllRequests,
  getMyFriends
}