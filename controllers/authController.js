const express = require("express");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {
  validateRegisterUser,
  User,
  validateLoginUser,
  validateResetPassword,
} = require("../models/User");


// Register User
const register = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "Email is already exist" });
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
  return res.status(200).json({ token, ...others });
});

// Login User
const login = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password,
  );
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const token = user.generateToken();
  const { password, ...others } = user.toObject();
  return res.status(200).json({ ...others, token });
});

// Get Register Page
const getRegisterPage = asyncHandler(async (req, res) => {
  res.render("register");
});

// Get Login Page
const getLoginPage = asyncHandler(async (req, res) => {
  res.render("login");
});

// Forgot Password
const getForgotPasswordPage = asyncHandler(async (req, res) => {
  res.render("forgot-password");
});

// Send Forgot Password Link
const sendForgotPasswodLink = asyncHandler(async (req,res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({message: "User was not found"})
  }
  const secret = process.env.JWT_SECRET_KEY + user.password;
  const token = jwt.sign({email, id: user.id}, secret, {expiresIn: '10m'})
  const link = `http://localhost:5000/auth/reset-password/${user.id}/${token}`
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,      
    }
  })
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: "Reset Password Link",
    html: `<div>
        <h3>Click the link below to reset your password</h3>
        <p>${link}</p>
      </div>
    `,
  }
    transporter.sendMail(mailOptions, (error, success) => {
      if (error) {
        console.error(error);
        return res.status(500).json({message: "Something went wrong"})
      } else {
        console.log(`Email Sent: ${success.response}`);
        res.render('link-send', { email })
      }
    })
})



const getResetPasswordPage = asyncHandler(async (req,res) => {
  const user = await User.findById(req.params.userId);
   if (!user) {
    return res.status(404).json({message: "User was not found"})
  }
    const secret = process.env.JWT_SECRET_KEY + user.password;
  try {
    jwt.verify(req.params.token, secret);
    res.render('reset-password', { 
        email: user.email, 
        userId: req.params.userId, 
        token: req.params.token 
    });
  } catch(err) {
    console.error(error);
    res.status(400).json({message: "Invalid or expired token"})
  }
})

const resetPassword = asyncHandler(async (req,res) => {
   const { error } = validateResetPassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({message: "User was not found"})
  }
  const secret = process.env.JWT_SECRET_KEY + user.password;
  try {
    jwt.verify(req.params.token, secret);

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;
    
    await user.save();
    res.render('success-link')
  } catch(err) {
    console.error(err);
    return res.status(400).json({message: 'Something went wrong'})
  }
})

module.exports = {
  register,
  login,
  getRegisterPage,
  getLoginPage,
  getForgotPasswordPage,
  sendForgotPasswodLink,
  getResetPasswordPage,
  resetPassword,
};
