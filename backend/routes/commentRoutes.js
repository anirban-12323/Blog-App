const express=require("express")

const { addComment,getComments}=require("../controllers/commentController")



const verifyUser=require("../middlewares/auth")

const route=express.Router()

route.post("/add/comment",verifyUser,addComment)
route.get("/blogs/:id/comment",getComments)

module.exports=route