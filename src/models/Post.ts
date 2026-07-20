import express from "express";
import mongoose, { Schema, Document, Types, model } from "mongoose";
import Joi from "joi";
interface IPost extends Document {
  title: string;
  description: string;
  user: Types.ObjectId;
  category: string;
  image: {
    url: string;
    publicId: string | null;
  };
  likes: Types.ObjectId[];
}
const PostSchema = new Schema<IPost>(
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
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: {
        url: { type: String },
        publicId: { type: String, default: null },
      },
      _id: false,
      default: {
        url: "",
        publicId: null,
      },
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
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

const validateCreatePost = (post: Omit<IPost, "user" | "likes">) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(32).required(),
    description: Joi.string().trim().min(10).max(250).required(),
    category: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().uri().required(),
      publicId: Joi.string().allow(null).required(),
    }).optional(),
  });

  return schema.validate(post);
};
const validateUpdatePost = (post: Partial<Omit<IPost, "user" | "likes">>) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(32),
    description: Joi.string().trim().min(10).max(250),
    category: Joi.string(),
    image: Joi.object({
      url: Joi.string().uri(),
      publicId: Joi.string().allow(null),
    }).optional(),
  });

  return schema.validate(post);
};

const Post = model<IPost>("Post", PostSchema);

export { Post, validateCreatePost, validateUpdatePost };
