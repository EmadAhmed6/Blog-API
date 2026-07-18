const express = require("express");
const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");

const getAllUsers = asyncHandler(async(req,res) => {
    const user = await User.find().select('-password');
    return res.status(200).json(user);
})


const getUserById = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id).select('-password');
    return res.status(200).json(user);
})

const updateUser = asyncHandler(async(req,res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        }
    }, {new: true, runValidators: true}).select('-password');
    return res.status(200).json(user);
})

const deleteUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({message: "User deleted successfully"})
    } else {
    return res.status(404).json({message: "User was not found"});
    } 
})

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
}