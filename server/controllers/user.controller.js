const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const { sendToken, cookieOptions, emitEvent, uploadFilesToClodinary } = require('../utils/features.js');
const Chat = require('../models/chat.js');
const Request = require('../models/request.js');
const { NEW_REQUEST, REFETCH_CHATS } = require('../constants/events.js');
const cloudinary = require('cloudinary');



const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    const username = name.trim();

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

    const { username, name, password, bio } = req.body;

    const file = req.file;

    const trimmedName = name.trim();
    const trimmedUserName = username.trim();

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
      name : trimmedName,
      username : trimmedUserName,
      password: hashhedPass,
      bio,
      avatar
    })

    res.status(201).json({message : 'User created', status : 'success'})
    // sendToken(res, createdUser, 201, "User created");

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
const getUserProfileDetail = async (req, res) => {
  try {
    const {userID} = req.query  
    const user = await User.findById(userID); 

    res.status(200).json({ status: 'success', message: 'User profile detail found', user })
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
  
  try {
    const { name } = req.query;

    // if (!name) {
    //   throw new Error('Please provide name of user');
    // }


    const myChats = await Chat.find({ groupChat: false, members: req.userID }).populate('members' , 'name avatar');


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
    const { name } = req.query;

    // Ensure chatID is provided
    if (!chatID) {
      return res.status(400).json({ status: 'error', message: 'Chat ID is required' });
    }

    // Fetch the chat group by chatID to get its members
    const chat = await Chat.findById(chatID).populate("members", "name avatar");
    
    if (!chat) {
      return res.status(404).json({ status: 'error', message: 'Chat not found' });
    }

    // Construct query for users
    const query = {
      _id: { $nin: chat.members.map(member => member._id) },  // Exclude users who are already members of the chat group
    };

    // If name is provided, add a regex filter to the query
    if (name && name.trim()) { // Ensure name is not empty or just whitespace
      query.name = { $regex: name, $options: 'i' };  // Case-insensitive search by name
    }

    // Fetch users who are not part of the chat group
    const friendsNotInChatGroup = await User.find(query, "name avatar");

    // Return the users who are not part of the chat group
    return res.status(200).json({
      status: "success",
      message: 'All friends fetched',
      friendsNotInGroup: friendsNotInChatGroup
    });
    
  } catch (error) {
    console.error('Error in fetching friends:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const {name} = req.query;
    const userID = req.userID


    const users = await User.find({name: { $regex: name, $options: 'i' }});

    const usersExeptMe = users.filter((user) => {
      return user._id.toString() !== userID.toString()
    })

    res.status(200).json({ status: 'success', message: 'all users fetched', users : usersExeptMe})
    
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

// Function to get members who are not the current user (i.e., other friends)



module.exports = {
  loginUser,
  createUser,
  getUser,
  logOut,
  searchUsers,
  sendRequest,
  acceptRequest,
  getAllRequests,
  getMyFriends,
  getUserProfileDetail,
  getAllUser
}