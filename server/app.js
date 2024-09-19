const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const allRoutes = require('./routes');
const { connectDB } = require('./utils/features');
const { Server } = require('socket.io');
const { createServer } = require('http');
const { NEW_MESSAGE, NEW_MESSAGE_ALERT } = require('./constants/events');
const uuid = require('uuid');
const cloudinary = require('cloudinary');
const Message = require('./models/message');
const { socketAuthenticator } = require('./middlewares/auth');
const { getUserSocketIDs, addSocketID, removeSocketID, getSocketID } = require('./lib/socketManager'); // Import socket manager functions
const Chat = require('./models/chat');

dotenv.config({
  path: './.env'
});

const port = process.env.PORT || 8000;
const DBURI = process.env.DBLink;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_PREVIEW],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.set('io', io); // Setting instance of io so I can access it in any file

app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_PREVIEW],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', allRoutes);

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (err) => {
    await socketAuthenticator(err, socket, next);
  });
});

io.on("connection", (socket) => {
  const user = socket.user;

  // Adding a user and their associated socket ID
  addSocketID(user._id.toString(), socket.id.toString());
  // console.log(getUserSocketIDs(), 'userSocketIDs');

  socket.on(NEW_MESSAGE, async ({ chatID, members, message }) => {
    console.log(members , "This is members");
    
    const messageForRealTime = {
      content: message,
      _id: uuid.v4(),
      sender: {
        _id: user._id,
        name: user.name,
        avatar : user.avatar
      },
      chat: chatID,
      createdAt: new Date().toISOString(),
    };

    // console.log(messageForRealTime, 'messageForRealTime');

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatID
    };


    // Emit the message to each member socket
    // members.forEach(member => {
      const socketId = getSocketID(members);
      console.log(socketId , 'This is socket id');
      
      if (socketId) {
        io.to(socketId).emit(NEW_MESSAGE, {
          chatID,
          message: messageForRealTime
        });
        
        io.to(socketId).emit(NEW_MESSAGE_ALERT, { chatID ,message: messageForRealTime}); //new message notification
      }


    try {
      const chat = await Chat.findById(chatID);
      const message = await Message.create(messageForDB);
      chat.latestMessage = message._id;
      await chat.save();
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('disconnect', () => {
    removeSocketID(user._id.toString());
    console.log('a user disconnected', socket.id);
  });
});

server.listen(port, async () => {
  console.log(`Listening on port ${port} in ${process.env.NODE_ENV.trim()} Mode`);
  await connectDB(DBURI);
});
