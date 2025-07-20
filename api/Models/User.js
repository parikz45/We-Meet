const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:5,
        max:20,
        unique:true
    },
    email:{
        type:String,
        required:true,
        min:5,
        max:30,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:8,
    },
    profilePicture:{
        type:String,
        default:"",
    },
    coverPicture:{
        type:String,
        default:"",
    },
    followers:{
        type:Array,
        default:[],
    },
    followings:{
        type:Array,
        default:[],
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    desc:{
        type:String,
        max:50,
    },
    city:{
        type:String,
        max:50,
    },
    state:{
        type:String,
        max:50,
    },
    relationship:{
        type:String,
    }
},
{timestamps: true}
);

module.exports = mongoose.model("User", UserSchema);