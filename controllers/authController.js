const express = require('express');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { validateRegisterUser, User, validateLoginUser } = require('../models/User');

// Register User
const register = asyncHandler(async(req,res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({message: error.details[0].message})
    }
    const user = await User.findOne({email: req.body.email});
    if (user) {
        return res.status(400).json({message: "Email is already exist"})
    }
    const genSalt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, genSalt);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    })
    const finalUser = await newUser.save();
    const token = finalUser.generateToken();
    const {password, ...others} = finalUser.toObject();
    return res.status(200).json({token, ...others})
})

// Login User
const login = asyncHandler(async(req,res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return res.status(400).json({message: "Invalid email or password"});
    }
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({message: "Invalid email or password"});
    }
    const token = user.generateToken();
    const {password, ...others} = user.toObject();
    return res.status(200).json({...others, token})
})
// Forgot Password

module.exports = {
    register,
    login,
}