const mongoose=require("mongoose");


const blogSchema=new mongoose.Schema({
  title:{
    type:String,
    trim:true,
    required:true
  },
  description:String,
  draft:{
    type:Boolean,
    default:false
  }
},
{timestamps:true}
);
const Blog=mongoose.model("Blog",blogSchema)
module.exports= Blog