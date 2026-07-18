const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 250,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

PostSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "postId",
  localField: "_id",
});

const validateCreatePost = (post) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(32).required(),
    description: Joi.string().trim().min(10).max(250).required(),
    user: Joi.string().required(),
    category: Joi.string().required(),
  });

  return schema.validate(post);
};
const validateUpdatePost = (post) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(32),
    description: Joi.string().trim().min(10).max(250),
    user: Joi.string(),
    category: Joi.string(),
  });

  return schema.validate(post);
};

const Post = mongoose.model("Post", PostSchema);

module.exports = {
  Post,
  validateCreatePost,
  validateUpdatePost,
};
