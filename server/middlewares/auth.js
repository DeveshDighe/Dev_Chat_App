const jwt= require('jsonwebtoken');
const User = require('../models/user');


const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.UserToken;

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

const socketAuthenticator =async (err, socket, next) => {
  try {
    if (err) {
      throw new Error('please login to access this socket');
    }

    const authToken = socket.request.cookies.UserToken;

    if (!authToken) {
      throw new Error('please login to access this socket');  
    }

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);

    if (!user) {
      throw new Error('please login to access this socket');  
      
    }

    socket.user = user;
    return next();
  } catch (error) {
    console.log(error);
    
    return next(error.message)
  }
}


module.exports = {
  isAuthenticated,
  socketAuthenticator
}