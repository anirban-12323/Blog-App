const express = require("express");
const upload = require("../utils/multer");

const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  dislikeBlog,
  likeBlog,
  saveBlog,
  searchBlog,
} = require("../controllers/blogController");

const verifyUser = require("../middlewares/auth");
const route = express.Router();

route.post("/blogs", verifyUser, upload.single("image"), createBlog);
route.get("/blogs", getBlogs);
route.get("/blogs/:blogId", getBlog);

route.patch("/blogs/:id", verifyUser, upload.single("image"), updateBlog);

route.delete("/blogs/:id", verifyUser, deleteBlog);
//search blog
route.get("/search-blog", searchBlog);

//like and dislike
route.post("/blogs/like/:id", verifyUser, likeBlog);
route.post("/blogs/:id/dislike", verifyUser, dislikeBlog);
route.patch("/save-blog/:id", verifyUser, saveBlog);
module.exports = route;
