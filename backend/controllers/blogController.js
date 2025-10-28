const Blog=require("../models/blogSchema")

async function createBlog(req,res){
 
  try {

    const{title,description,draft}=req.body
    if(!title||!description){
      return res.status(400).json({
      message:"please fill all the fields",
   
    })


    }

    const blog=await Blog.create({title,description,draft})

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
    const blogs=await Blog.find({draft:false})
    
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

}

async function deleteBlog(req,res){

}

module.exports={createBlog, getBlogs,getBlog,updateBlog,deleteBlog}



//(req,res)=>{
//   blogs.push({...req.body,id:blogs.length+1})
//     return res.json({message:"blog created successfully"})

// }