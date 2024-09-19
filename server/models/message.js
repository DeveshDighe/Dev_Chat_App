// import { Schema, model, models } from 'mongoose';
const {Schema, model, models, Types}  = require('mongoose')

const messageSchema = new Schema({
  content : String,
  attachements : [
    {
      _id: false,
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    }
  ],
  sender: {
    type: Types.ObjectId,
    ref : 'User',
    required : true
  },
  chat: {
    type: Types.ObjectId,
    ref : 'Chat',
    required : true
  },
}, { timestamps: true })


const Message = models.Message || model('Message', messageSchema);
module.exports = Message;  