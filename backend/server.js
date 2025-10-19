const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const dbConect = require("./config/dbConnect")
const app=express()
const userRoute=require("./routes/userRoutes")
const blogRoute=require("./routes/blogRoutes")



//anirbanguharoy82_db_user
//hIMRYw8OSzj1K7PY

app.use(express.json())
app.use(cors())
app.use("/api/v1",userRoute)
app.use("/",blogRoute)






//BLOG ROUTES



app.listen(3000,()=>{
  console.log("Server started")
  dbConect()
})


//
