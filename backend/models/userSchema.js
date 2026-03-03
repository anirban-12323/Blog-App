const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
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
  googleAuth: {
    type: Boolean,
    default: false,
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
