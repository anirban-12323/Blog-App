const mongoose=require("mongoose")

async function dbConect(){
  try {
    await mongoose.connect("mongodb+srv://anirbanguharoy82_db_user:hIMRYw8OSzj1K7PY@cluster0.804al0f.mongodb.net/Blogdatabase")
    console.log("DB conected successfully")
    
  } catch (error) {
    console.log("error aa gaya while conecting DB")
    console.log(error)
    
  }

}

module.exports=dbConect