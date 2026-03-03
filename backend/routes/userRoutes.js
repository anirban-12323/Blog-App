const express = require("express");

const {
  createUser,
  getUser,
  getUserBYID,
  updateUser,
  deleteUserByID,
  login,
  verifyToken,
  googleAuth,
} = require("../controllers/userController");

const route = express.Router();

route.post("/signup", createUser);
route.post("/signin", login);

route.get("/users", getUser);

route.get("/users/:id", getUserBYID);

route.patch("/users/:id", updateUser);

route.delete("/users/:id", deleteUserByID);

route.get("/verify-email/:verificationToken", verifyToken);
route.post("/google-auth", googleAuth);
module.exports = route;
