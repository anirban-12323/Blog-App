const express=require("express")
const app=express()
app.use(express.json())

const blogs=[]

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

app.patch("/blogs",(req,res)=>{

})

app.patch("/blogs/:id",(req,res)=>{

})

app.delete("/blogs",(req,res)=>{

})

app.listen(3000,()=>{
  console.log("Server started")
})