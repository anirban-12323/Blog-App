
const Comment=require("../models/commentSchema")
async function addComment(req,res){
  try {
    const{blogId,comment}=req.body

    if(!comment){
      return res.status(400).json({
        message:"vomment can not be empty"
      })
    }

    const newComment= await Comment.create({
      blogId,
      user:req.user,
      comment

    })

    return res.status(200).json({
      message:"comment added successfully",
      comment:newComment
    })
    
  } catch (error) {
    return res.status(500).json({
      message:error.message
    })
    
  }

}

async function getComments(req,res){
  try {
    const{id}=req.params
    const comments= await Comment.find({blogId:id})
    .populate("user","name email")
    .sort({createdAt:-1})
  .lean();
    return res.status(200).json({
      message: "Comments fetched success",
      comments
    });

    
  } catch (error) {
    console.log(error)
    
    return res.status(500).json({
    message:error.message
     
    })
    
  }

}

module.exports={addComment,getComments}