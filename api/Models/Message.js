const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    image: {
      type: String,
    },
    audio: {
      type: String,
      default:null,
    },
    replyTo:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Message",
      default:null
    },
    isSeen:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
