const Blog=require("../models/blogSchema")
const User=require("../models/userSchema")
const {verifyJWT} = require("../utils/generateToken");
const {uploadImage,deleteImagefromCloudinary} = require("../utils/uploadImage");
const fs=require("fs")

async function createBlog(req, res) {
  try {
    
    let token = req.headers.authorization?.split(" ")[1];
    let isValid = await verifyJWT(token);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    const creator = isValid.id;
    const { title, description, draft } = req.body;
    const image=req.file
    console.log({ title, description, draft,image})
   

    if (!title) {
      return res.status(400).json({
        message: "please fill title field",
      });
    }

    if (!description) {
      return res.status(400).json({
        message: "please fill description field",
      });
    }

    const findUser = await User.findById(creator);
     
    if (!findUser) {
      return res.status(500).json({
        message: "kon hei vai tu mei tuje nahi janta",
      });
    }

    const {secure_url,public_id}=await uploadImage(image.path)
    fs.unlinkSync(image.path)
   

    

    const blog = await Blog.create({ title, description, draft, creator,image:secure_url,imageId:public_id });
    console.log("Blog created:", blog);
    await User.findByIdAndUpdate(creator, { $push: { blogs: blog._id } });
    console.log("User updated!");

    return res.status(200).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
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
    

    const user=await User.findById(creator).select("-password")
    // console.log(user.blogs.find(blogId=>blogId===id))
    // 

    const blog=await Blog.findById(id)
    
    //blog.creator is a OBJECTID AND CREATOR IS STRING 
    if(!blog.creator.equals(creator)){
      return res.status(500).json({
        message:"You are not authorized for this action"
      })

     }

    //  const updatedBlog=await Blog.updateOne({_id:id},{
    //   title,
    //   description,
    //   draft

    //  },{new:true})

    blog.title=title ||  blog.title,
    blog.description=description || blog.description,
    blog.draft=draft || blog.draft

    await blog.save()
     return res.status(200).json({
      success:true,
      message:"Blog updated successfully",
      blog
     })
    // // const blog= await Blog.findByIdAndUpdate(blogId,{title,description,draft})
    
  } catch (error) {
    message:error.message
    
  }


}


async function likeBlog(req,res){
  try {
   const userId=req.user
   const {id}=req.params
   const blog= await Blog.findById(id)
   if(!blog){
    return res.status(404).json({
      message:"blog not found"
    })
   }

   //if already like , remove like

   if(blog.likes.includes(userId)){
    await Blog.findByIdAndUpdate(id, {
      $pull:{likes:userId}

    })
    return res.status(200).json({
      message:"liked removed"
    })

   }

   //dislike before remove dislike

   await Blog.findByIdAndUpdate(id,{
    $pull:{
      dislikes:userId
    }
   })

   //add like

   await Blog.findByIdAndUpdate(id,{
    $addToSet:{likes:userId}
   })
   return res.status(200).json({
    message:"Blog Liked"
   })

    
  } catch (error) {
    return res.status(400).json({
      message:error.message
    })
    
  }
}

async function dislikeBlog(req,res){
  try {
    const userId=req.user
    const {id}=req.params
    const blog=Blog.findById(id)
    if(!blog){
      return res.json({
        message:"Blog not found"
      })
    }

    //if already dislike remove dislike
    if(blog.dislikes.includes(userId)){
      await Blog.findByIdAndUpdate(id,{
        $pull:{dislikes:userId}
      })
      return res.json({
        message:"dislike removed"
      })
    }

    //remove like

    await Blog.findByIdAndUpdate(id,{
      $pull:{likes:userId}
    })

    await Blog.findByIdAndUpdate(id,{
      $addToSet:{dislikes:userId}
    })
    return res.json({
      message:"dislike added"
    })
    
  } catch (error) {
    return res.json({
      message:error.message
    })
    
  }
}

async function deleteBlog(req, res) {
  try {
    const creator = req.user;
    console.log("Creator:", creator);

    const { id } = req.params;

    const blog=Blog.findById(id)
    if(!blog){
      return res.status(500).json({
        success:false,
        message:"blog not found"
      })
    }
     if(!blog.creator.equals(creator)){
      return res.status(500).json({
        message:"You are not authorized for this action"
      })

     }
     await deleteImagefromCloudinary(blog.imageId)


    // 1. Delete the blog
    await Blog.findByIdAndDelete(id);

    // 2. Remove it from the user's blogs list
    await User.findByIdAndUpdate(
      creator,
      { $pull: { blogs: id } }
    );

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully"
    });

  } catch (error) {
    console.log("DELETE ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


module.exports={createBlog, getBlogs,getBlog,updateBlog,deleteBlog,likeBlog,dislikeBlog}



//(req,res)=>{
//   blogs.push({...req.body,id:blogs.length+1})
//     return res.json({message:"blog created successfully"})

// }