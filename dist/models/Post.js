import express from "express";
import mongoose, { Schema, Document, Types, model } from "mongoose";
import { CreatePostSchema, UpdatePostSchema, } from "../schemas/post.js";
const PostSchema = new Schema({
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
PostSchema.virtual("comments", {
    ref: "Comment",
    foreignField: "postId",
    localField: "_id",
});
const validateCreatePost = (post) => {
    return CreatePostSchema.safeParse(post);
};
const validateUpdatePost = (post) => {
    return UpdatePostSchema.safeParse(post);
};
const Post = model("Post", PostSchema);
export { Post, validateCreatePost, validateUpdatePost };
//# sourceMappingURL=Post.js.map