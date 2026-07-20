import Joi from "joi";
import jwt from "jsonwebtoken";
import mongoose, { Document, Schema, model } from "mongoose";
interface UserBase {
  username: string;
  email: string;
}
interface RegisterUser extends UserBase {
  password: string;
}

interface LoginUser {
  email: string;
  passsword: string;
}

interface IUser extends Document, UserBase {
  password: string;
  isAdmin: boolean;
  profilePicture: {
    url: string;
    publicId: string | null;
  };
  generateToken: () => string;
}
const passwordComplexity = (value?: string) =>
  Joi.string()
    .min(6)
    .max(72)
    .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      "string.pattern.base":
        "Password must include uppercase, lowercase, and numbers",
    });
const userSchema = new Schema<IUser>(
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
  },
  { timestamps: true },
);
userSchema.virtual("userPosts", {
  ref: "Posts",
  foreignField: "user",
  localField: "_id",
});

userSchema.methods.generateToken = function (this: IUser): string {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin, username: this.username },
    process.env.JWT_SECRET_KEY as string,
  );
};

const validateRegisterUser = (user: RegisterUser) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().trim().min(4).required(),
    password: passwordComplexity().required(),
  });
  return schema.validate(user);
};
const validateLoginUser = (user: LoginUser) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().min(4).required(),
    password: passwordComplexity().required(),
  });
  return schema.validate(user);
};
const validateResetPassword = (password: {
  password: string;
  confirmPassword: string;
}) => {
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

const validateUpdateUser = (
  user: Partial<IUser> & { image: { url: string; publicId: string | null } },
) => {
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

const User = model<IUser>("User", userSchema);

export {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateResetPassword,
  validateUpdateUser,
};
