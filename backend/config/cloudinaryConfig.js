const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("./dotenv.config");

const cloudinary = require("cloudinary").v2;
async function cloudinaryConfig() {
  require("dotenv").config();

  try {
    await cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
    console.log("cloudinary configuration successfully");
  } catch (error) {
    console.log("error aagaya while config cloudinary");
    console.log(error);
  }
}

module.exports = cloudinaryConfig;
