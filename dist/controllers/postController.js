import express, {} from "express";
import asyncHandler from "express-async-handler";
import { Post, validateCreatePost, validateUpdatePost, } from "../models/Post.js";
import path from "path";
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";
import { Types } from "mongoose";
// get All Posts
const getAllPosts = asyncHandler(async (req, res) => {
    const pageNumber = Number(req.query.pageNumber);
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
    res.status(200).json(posts);
    return;
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
    res.status(200).json(posts);
    return;
});
// Create Post
const createPost = asyncHandler(async (req, res) => {
    const { error } = validateCreatePost(req.body);
    if (error) {
        res
            .status(400)
            .json({ message: error.details[0]?.message || "Invalid Input" });
        return;
    }
    const newPost = new Post({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        image: req.body.image,
    });
    const finalPost = await newPost.save();
    res.status(201).json(finalPost);
    return;
});
// Update Post
const updatePost = asyncHandler(async (req, res) => {
    const { error } = validateUpdatePost(req.body);
    if (error) {
        res
            .status(400)
            .json({ message: error.details[0]?.message || "Invalid Input" });
        return;
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            image: req.body.image,
        },
    }, { new: true, runValidators: true });
    if (updatedPost) {
        res.status(200).json(updatedPost);
        return;
    }
    else {
        res.status(404).json({ message: "Post was not found" });
        return;
    }
});
// Delete Post
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post) {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post has been deleted successfully" });
    }
    else {
        res.status(404).json({ message: "Post was not found" });
    }
});
const uploadPostImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: "No file provided" });
        return;
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);
    res.status(200).json({
        message: "Uploaded successfully",
        url: result.secure_url,
        publicId: result.public_id,
    });
    return;
});
// Like Post
const likePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "You are not logged in" });
        return;
    }
    const post = await Post.findById(id);
    if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
    }
    const isLiked = post.likes.some((like) => like.toString() === userId);
    const userObjectId = new Types.ObjectId(userId);
    const updatedPost = await Post.findByIdAndUpdate(id, isLiked
        ? { $pull: { likes: userObjectId } }
        : { $push: { likes: userObjectId } }, { new: true }).populate("likes", ["_id", "username"]);
    res.status(200).json(updatedPost);
    return;
});
export { getAllPosts, getPostById, createPost, updatePost, deletePost, uploadPostImage, likePost, };
//# sourceMappingURL=postController.js.map