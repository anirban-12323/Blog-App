const mongoose=require("mongoose")

const commentSchema=new mongoose.Schema({

  blogId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Blog",
    required:true


  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true

  },
  comment:{
    type:String,
    required:true

  },
  createdAt:{
    type:Date,
    default:Date.now

  }



})

const Comment=mongoose.model("Comment",commentSchema)

module.exports=Comment