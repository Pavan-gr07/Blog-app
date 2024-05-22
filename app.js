require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthentication } = require("./middlewares/authentication");

const Blog = require("./models/blog");

const PORT = process.env.PORT || 8000;

const userRoute = require("./routes/users");
const blogRoute = require("./routes/blog");

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("MongoDB Connect"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set EJS as the view engine
app.set("view engine", "ejs");
// Set the views directory
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
