const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dnxvbqunk",
  api_key: "998887747584658",
  api_secret: "9FmEzcA6FdrrSbk7jjbNFTv6Qfs",
});
async function uploadImage(buffer) {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "blog-app",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      stream.end(buffer);
    });
  } catch (error) {
    console.log(error);
  }
}
async function deleteImagefromCloudinary(imageId) {
  try {
    await cloudinary.uploader.destroy(imageId);
  } catch (error) {
    console.log(error);
  }
}
module.exports = { uploadImage, deleteImagefromCloudinary };
