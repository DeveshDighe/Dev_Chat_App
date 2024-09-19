// import { Schema, model, models } from 'mongoose';
const {Schema, model, models, Types}  = require('mongoose')

const chatSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  groupChat: {
    type : Boolean,
    default : false,
  },
  groupImg : {
    type : String,        //Add only when the chat is group
  },
  creator: {
    type: Types.ObjectId,
    ref : 'User'
  },
  latestMessage : {
    type : Types.ObjectId,
    ref : 'Message'
  },
  members : [             // ARRAY OF OBJECTS Users
   {
      type : Types.ObjectId,   
      ref : "User"
    }
  ]
}, { timestamps: true })


const Chat = models.Chat || model('Chat', chatSchema);
module.exports = Chat;  