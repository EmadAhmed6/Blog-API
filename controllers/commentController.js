const express = require("express");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} = require("../models/Comment");
const { User } = require("../models/User");
const cloudinary = require("../utils/cloudinary");
// get All Comments
const getAllComments = asyncHandler(async (req, res) => {
  const { pageNumber } = req.query;
  const { postId } = req.params;
  const commentsPerPost = 5;

  const comments = await Comment.find({ postId })
    .populate("user", ["_id", "username"])
    .populate("likes", ["_id", "username"])
    .skip((pageNumber - 1) * commentsPerPost)
    .limit(commentsPerPost)
    .sort({ createdAt: -1 });
  return res.status(200).json(comments);
});

// Create Comment
const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const { error } = validateCreateComment({
    postId,
    text: req.body.text,
  });
  if (error) return res.status(400).json({ message: error.details[0].message });

  const newComment = new Comment({
    postId,
    text: req.body.text,
    user: req.user.id,
  });

  await newComment.save();

  const finalComment = await Comment.findById(newComment._id).populate("user", [
    "_id",
    "username",
  ]);

  return res.status(201).json(finalComment);
});

// Update Comment
const updateComment = asyncHandler(async (req, res) => {
  const { error } = validateUpdateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        text: req.body.text,
      },
    },
    { new: true, runValidators: true },
  ).populate("user", ["_id", "username"]);

  return res.status(200).json(updatedComment);
});

// Delete Comment
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (comment) {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Comment has been deleted successfully" });
  } else {
    res.status(404).json({ message: "Comment was not found" });
  }
});

// Like Comment
const likeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment was not found" });
  }

  const isLiked = comment.likes.includes(userId);
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    isLiked ? { $pull: { likes: userId } } : { $push: { likes: userId } },
    { new: true },
  ).populate("likes", ["_id", "username"]);

  return res.status(200).json(updatedComment);
});

// Upload Comment Image

const uploadCommentImage = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment was not found" });
  }

  const result = await cloudinary.uploader.upload(req.file.path);

  comment.image = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await comment.save();

  fs.unlinkSync(req.file.path);

  return res.status(200).json({
    message: "Uploaded comment image successfully",
    image: comment.image,
  });
});
module.exports = {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  uploadCommentImage,
};
