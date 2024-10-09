const jwt= require('jsonwebtoken');
const User = require('../models/user');


const isAuthenticated = (req, res, next) => {
  try {
    // const token = req.cookies.UserToken;
    const token =req.headers.authorization?.split(' ')[1];


    if (!token) {
      throw new Error('Please login first')
    }
    const userID = jwt.verify(token, process.env.JWT_SECRET)._id;

    req.userID = userID;
    
    next();
  } catch (error) {
    res.status(500).json({status : 'error', message : error.message})
  }
}

const socketAuthenticator = async (socket, next) => {
  try {
    // Extract the JWT from the Authorization header
    const token = socket.handshake.query.userToken;
    
    if (!token) {
      throw new Error('Please login to access this socket');
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);

    if (!user) {
      throw new Error('User not found. Please login again');
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error(error.message));
  }
};


module.exports = {
  isAuthenticated,
  socketAuthenticator
}