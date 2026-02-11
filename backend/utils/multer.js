const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadPath = path.join(__dirname, "../uploads");

//CREATE A FOLDER IF NOT EXISTS
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //SPECIFY THE DESTINATION FOLDER
    //MULTER ENSURE THE DIRECTORY IS CREATED IF IT DOES NOT EXIST WHEN PASSING A STRING
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    //GENERATE A UNIQUE FILENAME USING A TIMESTAMP
    cb(null, Date.now() + "-" + file.originalname);
  },
});
//CREATE THE MULTER INSTANCE WITH THE CONFIGURATION
const upload = multer({ storage });

module.exports = upload;
