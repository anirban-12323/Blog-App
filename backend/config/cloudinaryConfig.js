const cloudinary = require('cloudinary').v2;
async function cloudinaryConfig(){

  try {
    await  cloudinary.config({ 
  cloud_name: 'dnxvbqunk', 
  api_key: '998887747584658', 
  api_secret: '9FmEzcA6FdrrSbk7jjbNFTv6Qfs'
});
console.log("cloudinary configuration successfully")
    
  } catch (error) {
    console.log("erroe aagaya while config cloudinary")
    console.log(error)
    
  }
 
}

module.exports=cloudinaryConfig