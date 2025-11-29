const cloudinary = require("cloudinary").v2;
async function uploadImage(imagePath){

  try {
     cloudinary.config({ 
  cloud_name: 'dnxvbqunk', 
  api_key: '998887747584658', 
  api_secret: '9FmEzcA6FdrrSbk7jjbNFTv6Qfs'
});
console.log("object",imagePath)
  const result=await cloudinary.uploader.upload(imagePath,{
    folder:"blog-app",

    // format:"auto"

  })
  return result
    
  } catch (error) {
    console.log(error)
    
  }
 

}
 async function deleteImagefromCloudinary(imageId){
  try {
    await cloudinary.uploader.destroy(imageId)
    
  } catch (error) {
    console.log(error)
    
  }

 }
module.exports={uploadImage,deleteImagefromCloudinary}