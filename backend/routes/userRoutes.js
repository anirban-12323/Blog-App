const express = require("express");
const upload = require("../utils/multer");

const {
  createUser,
  getUser,
  getUserBYID,
  updateUser,
  deleteUserByID,
  login,
  verifyToken,
  googleAuth,
  followUsers,
} = require("../controllers/userController");
const verifyUser = require("../middlewares/auth");
const route = express.Router();

route.post("/signup", createUser);
route.post("/signin", login);

route.get("/users", getUser);

route.get("/users/:username", getUserBYID);

route.patch("/users/:id", upload.single("profilepic"), updateUser);

route.delete("/users/:id", deleteUserByID);

route.get("/verify-email/:verificationToken", verifyToken);
route.post("/google-auth", googleAuth);

route.patch("/follow-creator/:id", verifyUser, followUsers);

module.exports = route;
