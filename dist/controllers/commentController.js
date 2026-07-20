import express, {} from "express";
import fs from "fs";
import asyncHandler from "express-async-handler";
import { Comment, validateCreateComment, validateUpdateComment, } from "../models/Comment.js";
import { User } from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";
import { Types } from "mongoose";
// get All Comments
const getAllComments = asyncHandler(async (req, res) => {
    const pageNumber = Number(req.query.pageNumber) || 1;
    const postId = req.params.postId;
    if (!postId || typeof postId !== "string") {
        res.status(400).json({ message: "Post ID is required" });
        return;
    }
    const commentsPerPost = Number(req.query.commentsPerPost) || 5;
    const comments = await Comment.find({ postId: new Types.ObjectId(postId) })
        .populate("user", ["_id", "username"])
        .populate("likes", ["_id", "username"])
        .skip((pageNumber - 1) * commentsPerPost)
        .limit(commentsPerPost)
        .sort({ createdAt: -1 });
    res.status(200).json(comments);
    return;
});
// Create Comment
const createComment = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    if (!postId || typeof postId !== "string") {
        res.status(400).json({ message: "Post ID is required" });
        return;
    }
    const { error } = validateCreateComment({
        postId: new Types.ObjectId(postId),
        text: req.body.text,
    });
    if (error) {
        res
            .status(400)
            .json({ message: error.details[0]?.message || "Invalid Input" });
        return;
    }
    const newComment = new Comment({
        postId: new Types.ObjectId(postId),
        text: req.body.text,
        user: req.user.id,
    });
    await newComment.save();
    const finalComment = await Comment.findById(newComment._id).populate("user", ["_id", "username"]);
    res.status(201).json(finalComment);
    return;
});
// Update Comment
const updateComment = asyncHandler(async (req, res) => {
    const { error } = validateUpdateComment(req.body);
    if (error) {
        res
            .status(400)
            .json({ message: error.details[0]?.message || "Invalid Input" });
        return;
    }
    const commentId = req.params.id;
    if (!commentId || typeof commentId !== "string") {
        res.status(400).json({ message: "Comment ID is required" });
        return;
    }
    const updatedComment = await Comment.findByIdAndUpdate(new Types.ObjectId(commentId), {
        $set: {
            text: req.body.text,
        },
    }, { new: true, runValidators: true }).populate("user", ["_id", "username"]);
    res.status(200).json(updatedComment);
    return;
});
// Delete Comment
const deleteComment = asyncHandler(async (req, res) => {
    const commentId = req.params.id;
    if (!commentId || typeof commentId !== "string") {
        res.status(400).json({ message: "Comment ID is required" });
        return;
    }
    const comment = await Comment.findById(new Types.ObjectId(commentId));
    if (comment) {
        await Comment.findByIdAndDelete(new Types.ObjectId(commentId));
        res
            .status(200)
            .json({ message: "Comment has been deleted successfully" });
    }
    else {
        res.status(404).json({ message: "Comment was not found" });
    }
});
// Like Comment
const likeComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    if (!commentId || typeof commentId !== "string") {
        res.status(400).json({ message: "Comment ID is required" });
        return;
    }
    const userId = req.user?.id;
    if (!userId) {
        res
            .status(401)
            .json({ message: "You must be logged in to like this comment" });
        return;
    }
    const comment = await Comment.findById(new Types.ObjectId(commentId));
    if (!comment) {
        res.status(404).json({ message: "Comment was not found" });
        return;
    }
    const isLiked = comment.likes.some((likeId) => likeId.toString() === userId);
    const updatedComment = await Comment.findByIdAndUpdate(new Types.ObjectId(commentId), isLiked ? { $pull: { likes: userId } } : { $push: { likes: userId } }, { new: true }).populate("likes", ["_id", "username"]);
    res.status(200).json(updatedComment);
    return;
});
// Upload Comment Image
const uploadCommentImage = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    if (!commentId || typeof commentId !== "string") {
        res.status(400).json({ message: "Comment ID is required" });
        return;
    }
    if (!req.file) {
        res.status(400).json({ message: "No file provided" });
        return;
    }
    const comment = await Comment.findById(new Types.ObjectId(commentId));
    if (!comment) {
        res.status(404).json({ message: "Comment was not found" });
        return;
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    comment.image = {
        url: result.secure_url,
        publicId: result.public_id,
    };
    await comment.save();
    fs.unlinkSync(req.file.path);
    res.status(200).json({
        message: "Uploaded comment image successfully",
        image: comment.image,
    });
    return;
});
export { getAllComments, createComment, updateComment, deleteComment, likeComment, uploadCommentImage, };
//# sourceMappingURL=commentController.js.map