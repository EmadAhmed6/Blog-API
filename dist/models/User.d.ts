import { Document } from "mongoose";
import { type ILoginUser, type IOtp, type IRegisterUser, type IResetPassword } from "../schemas/auth.js";
import { type IUserSchema } from "../schemas/user.js";
interface IUser extends Document, IUserSchema {
    isAdmin: boolean;
    generateToken: () => string;
    isVerified: boolean;
    postsCount: number;
}
declare const validateRegisterUser: (user: IRegisterUser) => import("zod").ZodSafeParseResult<{
    username: string;
    email: string;
    password: string;
}>;
declare const validateLoginUser: (user: ILoginUser) => import("zod").ZodSafeParseResult<{
    email: string;
    password: string;
}>;
declare const validateForgotPassword: (email: string) => import("zod").ZodSafeParseResult<{
    email: string;
}>;
declare const validateResetPassword: (password: IResetPassword) => import("zod").ZodSafeParseResult<{
    password: string;
    confirmPassword: string;
}>;
declare const validateVerifyOtp: (data: IOtp) => import("zod").ZodSafeParseResult<{
    email: string;
    otp: string;
}>;
declare const validateUpdateUser: (user: Partial<IUser> & {
    profilePicture: {
        url: string;
        publicId: string | null;
    };
}) => import("zod").ZodSafeParseResult<{
    username?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    profilePicture?: {
        url: string;
        publicId: string | null;
    } | undefined;
}>;
declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export { User, validateRegisterUser, validateLoginUser, validateResetPassword, validateForgotPassword, validateVerifyOtp, validateUpdateUser, };
//# sourceMappingURL=User.d.ts.map