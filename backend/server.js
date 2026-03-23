const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dbConect = require("./config/dbConnect");
const cloudinaryConfig = require("./config/cloudinaryConfig");
const app = express();
const userRoute = require("./routes/userRoutes");
const blogRoute = require("./routes/blogRoutes");
const commentRoute = require("./routes/commentRoutes");
const { PORT, FRONTEND_URL } = require("./config/dotenv.config");

const port = PORT;

//anirbanguharoy82_db_user
//hIMRYw8OSzj1K7PY

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL }));
app.use("/api/v1", userRoute);
app.use("/api/v1", blogRoute);
app.use("/api/v1", commentRoute);

app.get("/", (req, res) => {
  res.send("hello ji kya haal");
});

app.listen(port, () => {
  console.log("Server started");
  dbConect();
  cloudinaryConfig();
});

//
