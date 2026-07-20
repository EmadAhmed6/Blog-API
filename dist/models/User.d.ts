import Joi from "joi";
import mongoose, { Document } from "mongoose";
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
declare const validateRegisterUser: (user: RegisterUser) => Joi.ValidationResult<any>;
declare const validateLoginUser: (user: LoginUser) => Joi.ValidationResult<any>;
declare const validateResetPassword: (password: {
    password: string;
    confirmPassword: string;
}) => Joi.ValidationResult<any>;
declare const validateUpdateUser: (user: Partial<IUser> & {
    image: {
        url: string;
        publicId: string | null;
    };
}) => Joi.ValidationResult<any>;
declare const User: mongoose.Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export { User, validateRegisterUser, validateLoginUser, validateResetPassword, validateUpdateUser, };
//# sourceMappingURL=User.d.ts.map