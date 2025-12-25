const cloudinary = require('cloudinary').v2;
async function cloudinaryConfig(){
 require("dotenv").config()

  try {
    await  cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET
});
console.log("cloudinary configuration successfully")
    
  } catch (error) {
    console.log("erroe aagaya while config cloudinary")
    console.log(error)
    
  }
 
}

module.exports=cloudinaryConfig