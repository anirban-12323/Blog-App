const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  email: {
    type: String,
    unique: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
  password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
