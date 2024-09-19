const Chat = require("../models/chat");
const Message = require("../models/message");
const User = require("../models/user")



const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    const trandformUsers = await Promise.all(
      users.map(async ({name, username, avatar, _id})=>{
        const [groupsCount, friendsCount] = await Promise.all([
          Chat.countDocuments({groupChat : true, members : _id}),
          Chat.countDocuments({groupChat : false, members : _id})
        ])
        return {
          name,
          username,
          avatar : avatar.url,
          _id,
          groupsCount,
          friendsCount
        }
      })
    )
    res.status(200).json({status : 'success', message : 'All users fetched for admin', data : trandformUsers})
  } catch (error) {
  res.status(500).json({status : 'error', message : error.message});
  }
}

const allChats = async (req, res) => {
  try {
    const chats = await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transformedChats = await Promise.all(
    chats.map(async ({ members, _id, groupChat, name, creator,groupImg }) => {
      const totalMessages = await Message.countDocuments({ chat: _id });

      return {
        _id,
        groupChat,
        name,
        avatar: groupImg,
        members: members.map(({ _id, name, avatar }) => ({
          _id,
          name,
          avatar: avatar.url,
        })),
        creator: {
          name: creator?.name || "None",
          avatar: creator?.avatar.url || "",
        },
        totalMembers: members.length,
        totalMessages,
      };
    })
  );

  return res.status(200).json({
    status: "success",
    message : 'All Chats fetched for admin',
    chats: transformedChats,
  });
  } catch (error) {
  res.status(500).json({status : 'error', message : error.message});
  }
}

const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");

  const transformedMessages = messages.map(
    ({ content, attachements, _id, sender, createdAt, chat }) => ({
      _id,
      attachements,
      content,
      createdAt,
      chat: chat._id,
      groupChat: chat.groupChat,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    })
  );

  return res.status(200).json({
    status: "success",
    message : 'All messages fetched for admin',
    messages: transformedMessages,
  });
  } catch (error) {
  res.status(500).json({status : 'error', message : error.message}); 
  }
}

const getDashboardStats = async (req, res) => {
  try {
    const [groupsCount, usersCount, messagesCount, totalChatsCount] =
    await Promise.all([
      Chat.countDocuments({ groupChat: true }),
      User.countDocuments(),
      Message.countDocuments(),
      Chat.countDocuments(),
    ]);

  const today = new Date();

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);   //getting last 7th day date

  const last7DaysMessages = await Message.find({
    createdAt: {
      $gte: last7Days,
      $lte: today,
    },
  }).select("createdAt");

  const messages = new Array(7).fill(0);      //creating array [0, 0, 0, 0, 0, 0, 0]
  const dayInMiliseconds = 1000 * 60 * 60 * 24; // calculates a day

  last7DaysMessages.forEach((message) => {
    const indexApprox =
      (today.getTime() - message.createdAt.getTime()) / dayInMiliseconds;   //getting time difference between today and the time when message was created.

      // Current Date Milliseconds: 1693296000000
      // 7 Days Ago Milliseconds: 1692691200000
      // gap in days : - 1693296000000 - 1692691200000 / dayInMiliseconds = 7 days
    const index = Math.floor(indexApprox);    //it might be in float conveting it to int

    // Index 0: Represents messages sent 6 days ago
    // Index 1: Represents messages sent 5 days ago 
    // And so on ...

    messages[6 - index]++;    
    // There are 7 elements in array, so 6 indicates lst 7th element and i am substracing (gap between current day and date of message creation)gap of days
  });

  // messages = [1, 0, 1, 1, 0, 1, 0];
  //This messages array is then used to create a chart or display the number of messages sent on each of the last 7 days

  const stats = {
    groupsCount,
    usersCount,
    messagesCount,
    totalChatsCount,
    messagesChart: messages,
  };

  return res.status(200).json({
    success: true,
    stats,
  });

  } catch (error) {
    
  }
}

const verifyAdmin = async (req, res) => {
    return res.status(200).json({
      admin: true,
    });

}
module.exports = {
  getAllUsers,
  allChats,
  allMessages,
  getDashboardStats,
  verifyAdmin
}