import Joi from "joi";
import jwt from "jsonwebtoken";
import mongoose, { Document, Schema, model } from "mongoose";
const passwordComplexity = (value) => Joi.string()
    .min(6)
    .max(72)
    .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
    "string.pattern.base": "Password must include uppercase, lowercase, and numbers",
});
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
    const schema = Joi.object({
        username: Joi.string().min(3).max(10).required(),
        email: Joi.string().email().trim().min(4).required(),
        password: passwordComplexity().required(),
    });
    return schema.validate(user);
};
const validateLoginUser = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().trim().min(4).required(),
        password: passwordComplexity().required(),
    });
    return schema.validate(user);
};
const validateResetPassword = (password) => {
    const schema = Joi.object({
        password: passwordComplexity().required(),
        confirmPassword: Joi.string()
            .valid(Joi.ref("password"))
            .required()
            .messages({
            "any.only": "Passwords do not match",
        }),
    });
    return schema.validate(password);
};
const validateUpdateUser = (user) => {
    const schema = Joi.object({
        username: Joi.string().trim().min(3).max(10),
        email: Joi.string().email().trim().min(4),
        password: passwordComplexity(),
        image: Joi.object({
            url: Joi.string().uri(),
            publicId: Joi.string().allow(null),
        }).optional(),
    });
    return schema.validate(user);
};
const User = model("User", userSchema);
export { User, validateRegisterUser, validateLoginUser, validateResetPassword, validateUpdateUser, };
//# sourceMappingURL=User.js.map