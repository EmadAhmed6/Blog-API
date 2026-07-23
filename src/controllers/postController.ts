import express, { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import {
  Post,
  validateCreatePost,
  validateUpdatePost,
} from "../models/Post.js";
import path from "path";
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";
import { Types } from "mongoose";
import { User } from "../models/User.js";

// get All Posts
const getAllPosts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const pageNumber = Number(req.query.pageNumber) || 1;
    const postsPerPage = 2;
    const posts = await Post.find()
      .populate("user", ["_id", "username", "profilePicture"])
      .populate("likes", ["_id", "username"])
      .populate({
        path: "comments",
        populate: [
          {
            path: "user",
            select: ["_id", "username"],
          },
          {
            path: "likes",
            select: ["_id", "username"],
          },
        ],
      })
      .skip((pageNumber - 1) * postsPerPage)
      .limit(postsPerPage);
    res.status(200).json({ success: true, data: posts });
    return;
  },
);

// Get Post By Id
const getPostById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const posts = await Post.findById(req.params.postId)
      .populate("user", ["_id", "username", "profilePicture"])
      .populate("likes", ["_id", "username"])
      .populate({
        path: "comments",
        populate: [
          {
            path: "user",
            select: ["_id", "username"],
          },
          {
            path: "likes",
            select: ["_id", "username"],
          },
        ],
      });
    res.status(200).json({ success: true, data: posts });
    return;
  },
);

// Create Post
const createPost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, success } = validateCreatePost(req.body);
    if (!success) {
      res.status(400).json({
        success: false,
        message: error.issues[0]?.message || "Invalid Input",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authorized" });
      return;
    }
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { postsCount: 1 },
    });

    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      image: req.body.image,
      user: req.user?.id,
    });

    const finalPost = await newPost.save();
    await finalPost.populate("user", ["_id", "username"]);
    res.status(201).json({ success: true, data: finalPost });
    return;
  },
);

// Update Post
const updatePost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, success } = validateUpdatePost(req.body);
    if (!success) {
      res.status(400).json({
        success: false,
        message: error.issues[0]?.message || "Invalid Input",
      });
      return;
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true, runValidators: true },
    );
    if (updatedPost) {
      res.status(200).json({ success: true, data: updatedPost });
      return;
    } else {
      res.status(404).json({ success: false, message: "Post was not found" });
      return;
    }
  },
);

// Delete Post
const deletePost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const post = await Post.findById(req.params.postId);
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, data: { message: "Not authorized" } });
      return;
    }
    if (post) {
      await Post.findByIdAndDelete(req.params.postId);
      await User.findByIdAndUpdate(req.user.id, { $inc: { postsCount: -1 } });
      res
        .status(200)
        .json({ success: true, message: "Post has been deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Post was not found" });
    }
  },
);

const uploadPostImage = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file provided" });
      return;
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);
    res.status(200).json({
      success: true,
      data: {
        message: "Uploaded successfully",
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
    return;
  },
);

// Like Post
const likePost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const postId = req.params.postId;
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: "You are not logged in" });
      return;
    }
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ success: false, message: "Post was not found" });
      return;
    }

    const isLiked = post.likes.some((like) => like.toString() === userId);
    const userObjectId = new Types.ObjectId(userId);
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      isLiked
        ? { $pull: { likes: userObjectId } as any }
        : { $push: { likes: userObjectId } as any },
      { new: true },
    ).populate("likes", ["_id", "username"]);

    res.status(200).json({ success: true, data: updatedPost });
    return;
  },
);

const sharePost = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res
      .status(401)
      .json({ success: false, data: { message: "Not authorized" } });
    return;
  }
  const { postId } = req.params;
  const { description } = req.body;
  const originalPost = await Post.findById(postId);
  if (!originalPost) {
    res
      .status(404)
      .json({ success: false, data: { message: "Post was not found" } });
    return;
  }
  const sharedPostRecord = new Post({
    title: originalPost?.title,
    description: description || "",
    category: originalPost?.category,
    image: originalPost?.image,
    user: req.user.id,
    sharedPost: originalPost?._id,
  });

  const savedSharedPost = await sharedPostRecord.save();
  await Post.findByIdAndUpdate(postId, {
    $inc: { sharesCount: 1 },
  });
  await Post.findByIdAndUpdate(req.user.id, {
    $inc: { postsCount: 1 },
  });
  res.status(201).json({
    success: true,
    data: { message: "Post shared successfully", savedSharedPost },
  });
  return;
});
export {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  uploadPostImage,
  likePost,
  sharePost,
};
