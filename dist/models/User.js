import { z } from "zod";
import jwt from "jsonwebtoken";
import mongoose, { Document, Schema, model } from "mongoose";
import { ForgotPasswordSchema, LoginSchema, passwordSchema, RegisterSchema, ResetPasswordSchema, } from "../schemas/auth.js";
import { UpdateUserSchema } from "../schemas/user.js";
const userSchema = new Schema({
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
    profilePicture: {
        type: {
            url: String,
            publicId: { type: String, default: null },
        },
        default: {
            url: "",
            publicId: null,
        },
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
userSchema.virtual("userPosts", {
    ref: "Posts",
    foreignField: "user",
    localField: "_id",
});
userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id, isAdmin: this.isAdmin, username: this.username }, process.env.JWT_SECRET_KEY);
};
const validateRegisterUser = (user) => {
    return RegisterSchema.safeParse(user);
};
const validateLoginUser = (user) => {
    return LoginSchema.safeParse(user);
};
const validateForgotPassword = (email) => {
    return ForgotPasswordSchema.safeParse(email);
};
const validateResetPassword = (password) => {
    return ResetPasswordSchema.safeParse(password);
};
const validateUpdateUser = (user) => {
    return UpdateUserSchema.safeParse(user);
};
const User = model("User", userSchema);
export { User, validateRegisterUser, validateLoginUser, validateResetPassword, validateForgotPassword, validateUpdateUser, };
//# sourceMappingURL=User.js.map