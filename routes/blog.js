const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

router.get("/add-new", (req, res) => {
  res.render("addBlog", { user: req.user });
});

router.post("/", upload.single("coverImage"), async (req, res, next) => {
  const { title, body } = req.body;

  if (!title || !body || !req.file) {
    return res.status(400).send("All fields are required");
  }

  try {
    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}`,
      author: req.user._id,
    });

    res.redirect(`/`);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
    );

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    res.render("blog", { user: req.user, blog, comments });
  } catch (error) {
    next(error);
  }
});

router.post("/comment/:blogId", async (req, res, next) => {
  try {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });

    res.redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
