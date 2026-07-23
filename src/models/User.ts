import jwt from "jsonwebtoken";
import { Document, Schema, model } from "mongoose";
import {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
  type ILoginUser,
  type IRegisterUser,
  type IResetPassword,
} from "../schemas/auth.js";
import { UpdateUserSchema, type IUserSchema } from "../schemas/user.js";
interface UserBase {
  username: string;
  email: string;
}

interface IUser extends Document, IUserSchema {
  isAdmin: boolean;
  generateToken: () => string;
  isVerified: boolean;
}

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
    isVerified: { type: Boolean, default: false },
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

const validateRegisterUser = (user: IRegisterUser) => {
  return RegisterSchema.safeParse(user);
};
const validateLoginUser = (user: ILoginUser) => {
  return LoginSchema.safeParse(user);
};
const validateForgotPassword = (email: string) => {
  return ForgotPasswordSchema.safeParse(email);
};
const validateResetPassword = (password: IResetPassword) => {
  return ResetPasswordSchema.safeParse(password);
};
const validateUpdateUser = (
  user: Partial<IUser> & {
    profilePicture: { url: string; publicId: string | null };
  },
) => {
  return UpdateUserSchema.safeParse(user);
};

const User = model<IUser>("User", userSchema);

export {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateResetPassword,
  validateForgotPassword,
  validateUpdateUser,
};
