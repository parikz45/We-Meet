const mongoose=require("mongoose");

const NotificationSchema=new mongoose.Schema(
    {
        senderId:{
            type:String,
            required:true
        },
        recieverId:{
            type:String,
            required:true
        },
        Type:{
            type:String, //like, comment, follow, message
            required:true
        },
        isRead:{
            type:Boolean,
            default:false
        },
    }
)

module.exports=mongoose.model("notifications", NotificationSchema);