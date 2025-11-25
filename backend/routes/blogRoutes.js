const express=require("express")


const{createBlog,getBlogs,getBlog,updateBlog,deleteBlog}=require("../controllers/blogController")


const verifyUser=require("../middlewares/auth")
const route=express.Router()

route.post("/blogs",verifyUser,createBlog)
route.get("/blogs",getBlogs)
route.get("/blogs/:id",getBlog)



route.patch("/blogs/:id",verifyUser,updateBlog)

route.delete("/blogs/:id",verifyUser,deleteBlog)

module.exports=route
