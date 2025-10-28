const express=require("express")
const{createBlog,getBlogs,getBlog,updateBlog,deleteBlog}=require("../controllers/blogController")



const route=express.Router()

route.post("/blogs",createBlog)
route.get("/blogs",getBlogs)
route.get("/blogs/:id",getBlog)



route.patch("/blogs/:id",updateBlog)

route.delete("/blogs/:id",deleteBlog)

module.exports=route
