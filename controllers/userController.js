const express = require("express");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary");
const { User, validateUpdateUser } = require("../models/User");
const fs = require("fs");
// GET ALL USERS
const getAllUsers = asyncHandler(async (req, res) => {
  const user = await User.find().select("-password");
  return res.status(200).json(user);
});

// GET USER BY ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  return res.status(200).json(user);
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      },
    },
    { new: true, runValidators: true },
  ).select("-password");
  return res.status(200).json(user);
});

// DELETE USER
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } else {
    return res.status(404).json({ message: "User was not found" });
  }
});

// Upload User Profile Picture
const uploadUserPicture = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User was not found" });
  }
  const result = await cloudinary.uploader.upload(req.file.path);

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        profilePicture: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      },
    },
    { new: true },
  ).select("-password");

  fs.unlinkSync(req.file.path);
  return res.status(200).json(updatedUser);
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadUserPicture,
};
