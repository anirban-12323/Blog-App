const express=require("express")
const app=express()
app.use(express.json())

//USER ROUTES
let users=[]
app.post("/users",(req,res)=>{
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

    users.push({...req.body,id:users.length+1})
    return res.status(200).json({
      success:true,
      message:"User created successfully"
    })
    
  } catch (error) {

    return res.status(400).json({
      success:false,
      message:"Please try again"

    })
    
  }

})

app.get("/users",(req,res)=>{
  try {
    
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


app.get("/users/:id",(req,res)=>{

  try {
    const user=users.filter(user=>user.id==req.params.id)
    if(user.length==0){
      return res.status(400).json({
      success:false,
      message:"user not found",
      user
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

app.patch("/users/:id",(req,res)=>{
  
  try {
    const{id}=req.params
    let updatedUser=users.map((user,index)=>user.id==id?({...users[index],...req.body}):user)
    users=[...updatedUser]
    return res.status(200).json({
      success:true,
      message:"user updated successfully",
      updatedUser})
    
  } catch (error) {
    return res.status(400).json({
      success:false,
      message:"error during user update"

    })
    
    
  }
})

app.delete("/users/:id",(req,res)=>{
 

   try {
     const{id}=req.params
     let deleteUser=users.filter(user=>user.id!=id)
     users=[...deleteUser]
     return res.status(200).json({
      success:true,
      message:"user deleted successfully",
      users
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
})