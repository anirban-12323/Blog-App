const mongoose = require("mongoose");
const { DB_URL } = require("./dotenv.config");

async function dbConect() {
  try {
    await mongoose.connect(DB_URL);
    console.log("DB conected successfully");
  } catch (error) {
    console.log("error aa gaya while conecting DB");
    console.log(error);
  }
}

module.exports = dbConect;
