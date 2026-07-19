const express = require("express");
const asyncHandler = require("express-async-handler");
const {
  Post,
  validateCreatePost,
  validateUpdatePost,
} = require("../models/Post");
const path = require("path");
const cloudinary = require("../utils/cloudinary");

// get All Posts
const getAllPosts = asyncHandler(async (req, res) => {
  const { pageNumber } = req.query;
  const postsPerPage = 2;
  const posts = await Post.find()
    .populate("user", ["_id", "username"])
    .populate("likes", ["_id", "username"])
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: ["_id", "username"],
      },
    })

    .skip((pageNumber - 1) * postsPerPage)
    .limit(postsPerPage);
  return res.status(200).json(posts);
});

// Get Post By Id
const getPostById = asyncHandler(async (req, res) => {
  const posts = await Post.findById(req.params.id)
    .populate("user", ["_id", "username"])
    .populate("likes", ["_id", "username"])
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: ["_id", "username"],
      },
    });
  return res.status(200).json(posts);
});

// Create Post
const createPost = asyncHandler(async (req, res) => {
  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    user: req.user.id,
    category: req.body.category,
    image: req.body.image,
  });
  const finalPost = await newPost.save();
  return res.status(201).json(finalPost);
});

// Update Post
const updatePost = asyncHandler(async (req, res) => {
  const { error } = validateUpdatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        user: req.body.user,
        category: req.body.category,
        image: req.body.image,
      },
    },
    { new: true, runValidators: true },
  );
  if (updatedPost) {
    return res.status(200).json(updatedPost);
  } else {
    return res.status(404).json({ message: "Post was not found" });
  }
});

// Delete Post
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post has been deleted successfully" });
  } else {
    res.status(404).json({ message: "Post was not found" });
  }
});

const uploadPostImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const result = await cloudinary.uploader.upload(req.file.path);
  fs.unlinkSync(req.file.path);
  return res.status(200).json({
    message: "Uploaded successfully",
    url: result.secure_url,
    publicId: result.public_id,
  });
});

// Like Post
const likePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const isLiked = post.likes.includes(userId);

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    isLiked ? { $pull: { likes: userId } } : { $push: { likes: userId } },
    { new: true },
  ).populate("likes", ["_id", "username"]);

  return res.status(200).json(updatedPost);
});

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  uploadPostImage,
  likePost,
};
