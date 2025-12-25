const mongoose=require("mongoose")
require("dotenv").config()

async function dbConect(){
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log("DB conected successfully")
    
  } catch (error) {
    console.log("error aa gaya while conecting DB")
    console.log(error)
    
  }

}

module.exports=dbConect