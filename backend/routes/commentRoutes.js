const express = require("express");

const {
  addComment,
  getCommentsByBlog,
  editComment,
  deleteComment,
  getCommentCount,
  likesComment,
  addNestedComment,
} = require("../controllers/commentController");

const verifyUser = require("../middlewares/auth");

const route = express.Router();

route.post("/blogs/:blogId/comment", verifyUser, addComment);
route.get("/blogs/:blogId/comments", getCommentsByBlog);
route.post("/comments/:commentId/like", verifyUser, likesComment);

route.put("/comments/:commentId", verifyUser, editComment);
route.delete("/comments/:commentId", verifyUser, deleteComment);
route.get("/blogs/:blogId/comments/count", getCommentCount);

route.post("/comment/:parentCommentId/:blogId", verifyUser, addNestedComment);

module.exports = route;
