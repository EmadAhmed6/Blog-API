const express = require("express");
const asyncHandler = require("express-async-handler");
const {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} = require("../models/Comment");
const { User } = require("../models/User");

// get All Comments
const getAllComments = asyncHandler(async (req, res) => {
  const { pageNumber } = req.query;
  const { postId } = req.params;
  const commentsPerPost = 5;

  const comments = await Comment.find({ postId })
    .populate("user", ["_id", "username"])
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

  const finalComment = await Comment.findById(newComment._id).populate("user", ["_id", "username"]);

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
  } 
);

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

module.exports = {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
};
