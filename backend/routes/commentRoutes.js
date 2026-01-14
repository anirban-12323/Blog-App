const express = require("express");

const {
  addComment,
  getComments,
  editComment,
  deleteComment,
  getCommentCount,
} = require("../controllers/commentController");

const verifyUser = require("../middlewares/auth");

const route = express.Router();

route.post("/add/comment", verifyUser, addComment);
route.get("/blogs/:id/comment", getComments);
route.put("/comments/:commentId", verifyUser, editComment);
route.delete("/comments/:commentId", verifyUser, deleteComment);
route.get("/blogs/:blogId/comments/count", getCommentCount);

module.exports = route;
