const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const app=express()

//anirbanguharoy82_db_user
//hIMRYw8OSzj1K7PY

app.use(express.json())
app.use(cors())
async function dbConected(){
  try {
    await mongoose.connect("mongodb+srv://anirbanguharoy82_db_user:hIMRYw8OSzj1K7PY@cluster0.804al0f.mongodb.net/Blogdatabase")
    console.log("DB conected successfully")
    
  } catch (error) {
    console.log("error aa gaya while conecting DB")
    console.log(error)
    
  }

}

const userSchema=new mongoose.Schema({
  name:String,
  email:{
    type:String,
    unique:true

  },
  password:String
})

const User=mongoose.model("User",userSchema)

//USER ROUTES

app.post("/users",async(req,res)=>{
  const{name,email,password}=req.body
  try {
   
    
    if(!name){
      return res.status(400).json({
        success:false,
        message:"Please enter name"
      })
    }
     if(!password){
      return res.status(400).json({
        success:false,
        message:"Please enter password"
      })
    }
     if(!email){
      return res.status(400).json({
        success:false,
        message:"Please enter email"
      })
    }

    const chekedforexitingUser= await User.findOne({email})
    if(chekedforexitingUser){
      return res.status(400).json({
        success:false,
        message:"User already registered with this email"
      })
    }

  const newUser=await User.create({
    name,
    email,
    password
  })
    return res.status(200).json({
      success:true,
      message:"User created successfully",
      newUser
    })
    
  } catch (error) {

    return res.status(400).json({
      success:false,
      message:"Please try again",
      error:error.message

    })
    
  }

})

app.get("/users",async(req,res)=>{
  try {


    const users= await User.find({})

    
    return res.status(200).json({
      success:true,
      message:"user fetch successfully",
      users
    })
    
  } catch (error) {
     return res.status(400).json({
      success:false,
      message:"error occur during user fetching"

    })
    
  }
})


app.get("/users/:id",async (req,res)=>{
  

  

  try {
      const id=req.params.id
    const user= await User.findById({_id:id})
 

  
    
    if(!user){
      return res.status(400).json({
      success:false,
      message:"user not found",
      
    })

    }
    return res.status(200).json({
      success:true,
      message:"user fetch successfully",
      user
    })
    
  } catch (error) {
     return res.status(400).json({
      success:false,
      message:"error occur during user fetching"

    })
    
  }

})

app.patch("/users/:id",async(req,res)=>{
  
  try {
   const id=req.params.id
   const{name,password,email}=req.body

   const UpdateUser= await User.findByIdAndUpdate(id,{name,password,email},{new:true})
   
   if(!UpdateUser){
      return res.status(400).json({
      success:false,
      message:"user not found",
      
    })

    }
    return res.status(200).json({
      success:true,
      message:"user updated successfully",
     UpdateUser
    })
    
    
    
  } catch (error) {
    return res.status(400).json({
      success:false,
      error:error.message,
      message:"error during user update"

    })
    
    
  }
})

app.delete("/users/:id",async(req,res)=>{
 

   try {
    const id=req.params.id
   const{name,password,email}=req.body

   const deletedUser= await User.findByIdAndUpdate(id)
   
   if(!deletedUser){
      return res.status(400).json({
      success:false,
      message:"user not found",
      
    })

    }
    return res.status(200).json({
      success:true,
      message:"user deleted successfully",
     deletedUser
    })
     
    
   } catch (error) {
    return res.status(400).json({
      success:false,
      message:"Faceing error during deleting the user"
    })
    
   }
})






//BLOG ROUTES
let blogs=[]

app.post("/blogs",(req,res)=>{
  blogs.push({...req.body,id:blogs.length+1})
    return res.json({message:"blog created successfully"})

})
app.get("/blogs",(req,res)=>{
  
  let publicBlogs=blogs.filter(blog=>blog.draft==false)
  
  return res.json({publicBlogs})

})
app.get("/blogs/:id",(req,res)=>{
  const {id}=req.params

  let searchBlog=blogs.filter(blog=>blog.id==id)

  return res.json({searchBlog})

})



app.patch("/blogs/:id",(req,res)=>{

  const{id}=req.params

  // let index=blogs.findIndex(blog=>blog.id==id)

  // blogs[index]={...blogs[index],...req.body}

  let updatedBlogs=blogs.map((blog,index)=>blog.id==id?({...blogs[index],...req.body}):blog)

  blogs=[...updatedBlogs]

  return res.json({message:"blog updated successfully",updatedBlogs})

})

app.delete("/blogs/:id",(req,res)=>{
  const{id}=req.params

   let deleteBlog=blogs.filter(blog=>blog.id!=id)

   blogs=[...deleteBlog]

   return res.json({message:"deleted blog successfully"})

})

app.listen(3000,()=>{
  console.log("Server started")
  dbConected()
})


//
