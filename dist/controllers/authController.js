import express, {} from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { validateRegisterUser, User, validateLoginUser, validateResetPassword, validateForgotPassword, } from "../models/User.js";
// Register User
const register = asyncHandler(async (req, res) => {
    const { error, success } = validateRegisterUser(req.body);
    if (!success) {
        res
            .status(400)
            .json({ message: error.issues[0]?.message || "Invalid Input" });
        return;
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        res.status(400).json({ message: "Email is already exist" });
        return;
    }
    const genSalt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, genSalt);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });
    const finalUser = await newUser.save();
    const token = finalUser.generateToken();
    const { password, ...others } = finalUser.toObject();
    res.status(200).json({ token, ...others });
});
// Login User
const login = asyncHandler(async (req, res) => {
    const { error, success } = validateLoginUser(req.body);
    if (!success) {
        res
            .status(400)
            .json({ message: error.issues[0]?.message || "Invalid Input" });
        return;
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
    }
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
    }
    const token = user.generateToken();
    const { password, ...others } = user.toObject();
    res.status(200).json({ ...others, token });
    return;
});
// Send Forgot Password Link
const sendForgotPasswodLink = asyncHandler(async (req, res) => {
    const { error, success } = validateForgotPassword(req.body);
    if (!success) {
        res.status(400).json({ message: error.issues[0]?.message });
        return;
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404).json({ message: "User was not found" });
        return;
    }
    const secret = process.env.JWT_SECRET_KEY + user.password;
    const token = jwt.sign({ email, id: user.id }, secret, {
        expiresIn: "10m",
    });
    const link = `http://localhost:5000/auth/reset-password/${user.id}/${token}`;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS,
        },
    });
    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: user.email,
        subject: "Reset Password Link",
        html: `<div>
        <h3>Click the link below to reset your password</h3>
        <p>${link}</p>
      </div>
    `,
    };
    transporter.sendMail(mailOptions, (error, success) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Something went wrong" });
        }
        else {
            console.log(`Email Sent: ${success.response}`);
            return res.status(200).json({
                message: "Password reset link sent successfully to your email",
            });
        }
    });
});
const resetPassword = asyncHandler(async (req, res) => {
    const { error, success } = validateResetPassword(req.body);
    if (!success) {
        res
            .status(400)
            .json({ message: error.issues[0]?.message || "Invalid Input" });
        return;
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
        res.status(404).json({ message: "User was not found" });
        return;
    }
    const secret = process.env.JWT_SECRET_KEY + user.password;
    try {
        jwt.verify(req.params.token, secret);
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        user.password = req.body.password;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ message: "Something went wrong" });
        return;
    }
});
export { register, login, sendForgotPasswodLink, resetPassword };
//# sourceMappingURL=authController.js.map