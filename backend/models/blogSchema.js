const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: String,
    draft: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object,
      required: true,
    },
    blogId: {
      type: String,
      required: true,
      unique: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
      required: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },

    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    totalSaves: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true },
);
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
