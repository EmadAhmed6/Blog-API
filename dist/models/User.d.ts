import { z } from "zod";
import mongoose, { Document } from "mongoose";
import { type ILoginUser, type IRegisterUser, type IResetPassword } from "../schemas/auth.js";
interface UserBase {
    username: string;
    email: string;
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
declare const validateRegisterUser: (user: IRegisterUser) => z.ZodSafeParseResult<{
    username: string;
    email: string;
    password: string;
}>;
declare const validateLoginUser: (user: ILoginUser) => z.ZodSafeParseResult<{
    email: string;
    password: string;
}>;
declare const validateForgotPassword: (email: string) => z.ZodSafeParseResult<{
    email: string;
}>;
declare const validateResetPassword: (password: IResetPassword) => z.ZodSafeParseResult<{
    password: string;
    confirmPassword: string;
}>;
declare const validateUpdateUser: (user: Partial<IUser> & {
    image: {
        url: string;
        publicId: string | null;
    };
}) => z.ZodSafeParseResult<{
    username?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    image?: {
        url: string;
        publicId: string | null;
    } | undefined;
}>;
declare const User: mongoose.Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export { User, validateRegisterUser, validateLoginUser, validateResetPassword, validateForgotPassword, validateUpdateUser, };
//# sourceMappingURL=User.d.ts.map