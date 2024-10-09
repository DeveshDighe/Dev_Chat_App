const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const uuid =require('uuid');
const cloudinary = require('cloudinary');
const { getBase64, getSockets } = require('../lib/helper');
const { getSocketID } = require('../lib/socketManager');


const cookieOptions = {
  maxAge : 15 * 24 * 60 * 60 *1000,
    sameSite : "none",
    httpOnly : true,
    secure : true
}

const connectDB = async (url) => {
  mongoose.connect(url)
  .then(()=>{
    console.log('connected to DB');
  })
  .catch((err)=>{
    console.log('Db connection error : ', err);
  })
}


const sendToken =async (res, user, statusCode, message) => {
  const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET);



  return res.status(statusCode).json({
    message, status : 'success', user, token
  })
}

const emitEvent = (req, event , users, data) => {
  let io = req.app.get('io');
  const membersSockets = getSocketID(users);
  console.log(membersSockets , "This is member socket");
  
  io.to(membersSockets).emit(event, data);

console.log('Emitign evebt');

}

const uploadFilesToClodinary = async (files, folder) => { 
  const uploadPromises = files.map((file) => {
    files.forEach(file => {
      const mimeType = file.mimetype;

      if (mimeType.startsWith('image/')) {
        folder ='image attachments';
      } else if (mimeType.startsWith('audio/')) {
        folder = 'audio attachments';
      } else if (mimeType.startsWith('video/')) {
        folder = 'video attachments'
      } else {
        folder = 'file attachments' // For unsupported file types
      }
    });
    return new Promise((resolve, reject) => {
      // Convert the buffer to a base64 string with a MIME type prefix
      const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      
      cloudinary.v2.uploader.upload(
        base64String,
        {
          resource_type: 'auto',
          folder : folder
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResult = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url, // Correct property for secure URL
    }));

    return formattedResult;
  } catch (error) {
    throw new Error(`Error in uploading files to Cloudinary: ${error.message}`);
  }
};

const deleteFilesFromClodinary = async (public_ids) => {

}

module.exports = {
  connectDB,
  sendToken,
  cookieOptions,
  emitEvent,
  uploadFilesToClodinary,
  deleteFilesFromClodinary,
}; 