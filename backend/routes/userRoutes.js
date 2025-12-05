const express=require("express")

const { createUser, getUser, getUserBYID, updateUser, deleteUserByID ,login} = require("../controllers/userController");



const route=express.Router()



route.post("/signup",createUser)
route.post("/signin",login)

route.get("/users",getUser)


route.get("/users/:id",getUserBYID)

route.patch("/users/:id",updateUser)


route.delete("/users/:id",deleteUserByID)

module.exports=route




