const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const passwordComplexity = require('joi-password-complexity');
const {default: mongoose} = require('mongoose');

const userSchema = new mongoose.Schema(
     {
        username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 10,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    posts: {
        type: Number,
        required: true,
        default: 0,
    },
    comments: {
        type: Number,
        default: 0,
    },
}, {timestamps: true});


userSchema.methods.generateToken = function() {
    return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET_KEY)
}

const validateRegisterUser = user => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(10).required(),
        email: Joi.string().email().trim().min(4).required(),
        password: passwordComplexity().required(),
    })
    return schema.validate(user);
}

const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    validateRegisterUser,
}