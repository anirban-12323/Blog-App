const Blog=require("../models/blogSchema")
const User=require("../models/userSchema")
const {verifyJWT} = require("../utils/generateToken")

async function createBlog(req,res){
 
  try {
    
    let token = req.headers.authorization?.split(" ")[1];
let isValid = await verifyJWT(token);

    // console.log(isValid)
    console.log(isValid)

    if(!isValid){
      return res.status(400).json({

        message:"Invalid token"
      })
    }
    const creator=isValid.id
    const{title,description,draft}=req.body
    if(!title){
      return res.status(400).json({
      message:"please fill title  field",
   
    })
    if(!description){
      return res.status(400).json({
        message:"please fill description field"
      })
    }
    }
    
    const findUser=await User.findById(creator)
    if(!findUser){
      return res.status(500).json({
        message:"kon hei vai tu mei tuje nahi janta"
      })
    }

    const blog=await Blog.create({title,description,draft,creator})
    await User.findByIdAndUpdate(creator,{$push:{blogs:blog._id}})

    return res.status(200).json({
      message:"Blog created successfully",
      blog
    })
    
  } catch (error) {
    return res.status(500).json({
      message:error.message,
      
    })

    
  }
}
async function getBlogs(req,res){

  try {
    // const blogs=await Blog.find({draft:false}).populate("creator")
     const blogs=await Blog.find({draft:false}).populate({
      path:"creator",
      select:"name"
     })
    
    return res.status(200).json({
      message:"Blogs fetch successfully",
      blogs
    })
    
  } catch (error) {
    return res.status(500).json({
      message:error.message,
      
    })
  }

}
async function getBlog(req,res){
  try {
    const {id}=req.params
    const blog=await Blog.findById(id)
    return res.status(200).json({
      message:"Blog fetch successfully",
      blog
    })

    
  } catch (error) {
    return res.status(500).json({
      message:error.message,
      
    })
    
  }

}

async function updateBlog(req,res){
  try {
    const creator=req.user

    const {id}=req.params
    const{title,description,draft}=req.body
    console.log("REQ BODY →", req.body);

    const user=await User.findById(creator).select("-password")
    // console.log(user.blogs.find(blogId=>blogId===id))
    // 

    const blog=await Blog.findById(id)
    console.log(creator,blog.creator)
    //blog.creator is a OBJECTID AND CREATOR IS STRING 
    if(!blog.creator.equals(creator)){
      return res.status(500).json({
        message:"You are not authorized for this action"
      })

     }

     const updatedBlog=await Blog.updateOne({_id:id},{
      title,
      description,
      draft

     },{new:true})
     return res.status(200).json({
      success:true,
      message:"Blog updated successfully",
      blog:updatedBlog
     })
    // // const blog= await Blog.findByIdAndUpdate(blogId,{title,description,draft})
    
  } catch (error) {
    console.log(error)
    
  }


}

async function deleteBlog(req,res){

}

module.exports={createBlog, getBlogs,getBlog,updateBlog,deleteBlog}



//(req,res)=>{
//   blogs.push({...req.body,id:blogs.length+1})
//     return res.json({message:"blog created successfully"})

// }