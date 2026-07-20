import express from "express";
import mongoose, { Document, model, Schema, Types } from "mongoose";
import Joi from "joi";
interface IComment extends Document {
  postId: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  image: {
    url: string;
    publicId: string | null;
  };
  likes: Types.ObjectId[];
}
const CommentSchema = new Schema<IComment>(
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
    image: {
      type: {
        url: { type: String },
        publicId: { type: String, default: null },
      },
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
  { timestamps: true },
);
const validateCreateComment = (comment: IComment) => {
  const schema = Joi.object({
    postId: Joi.string().required(),
    text: Joi.string().trim().required(),
    image: Joi.object({
      url: Joi.string().uri().required(),
      publicId: Joi.string().allow(null).required(),
    }).optional(),
  });

  return schema.validate(comment);
};
const validateUpdateComment = (comment: Partial<IComment>) => {
  const schema = Joi.object({
    text: Joi.string().trim(),
    image: Joi.object({
      url: Joi.string().uri(),
      publicId: Joi.string().allow(null),
    }).optional(),
  });
  return schema.validate(comment);
};

const Comment = model<IComment>("Comment", CommentSchema);

export { Comment, validateCreateComment, validateUpdateComment };
