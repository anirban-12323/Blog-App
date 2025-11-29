const express=require("express")
const upload=require("../utils/multer")


const{createBlog,getBlogs,getBlog,updateBlog,deleteBlog,dislikeBlog,likeBlog}=require("../controllers/blogController")


const verifyUser=require("../middlewares/auth")
const route=express.Router()

route.post("/blogs",verifyUser,upload.single("image"),createBlog)
route.get("/blogs",getBlogs)
route.get("/blogs/:id",getBlog)



route.patch("/blogs/:id",verifyUser,updateBlog)

route.delete("/blogs/:id",verifyUser,deleteBlog)
route.post("/blogs/:id/like",verifyUser,likeBlog)
route.post("/blogs/:id/dislike",verifyUser,dislikeBlog)
module.exports=route
