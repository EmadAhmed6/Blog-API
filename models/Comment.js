const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");

const CommentSchema = mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);
const validateCreateComment = (comment) => {
  const schema = Joi.object({
    postId: Joi.string().required(),
    text: Joi.string().trim().required(),
  });

  return schema.validate(comment);
};
const validateUpdateComment = (comment) => {
  const schema = Joi.object({
    text: Joi.string().trim(),
  });
  return schema.validate(comment);
};

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = {
  Comment,
  validateCreateComment,
  validateUpdateComment,
};
