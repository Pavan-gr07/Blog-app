const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageURL: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // Referencing the "User" model
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", // Ensure the reference is correct
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Blog = model("Blog", blogSchema);

module.exports = Blog;
