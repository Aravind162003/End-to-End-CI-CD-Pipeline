import mongoose from "mongoose";

const userScheama=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
})

export default mongoose.model("User",userScheama);