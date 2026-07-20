import mongoose, { Document, Types } from "mongoose";
import Joi from "joi";
interface IPost extends Document {
    title: string;
    description: string;
    user: Types.ObjectId;
    category: string;
    image: {
        url: string;
        publicId: string | null;
    };
    likes: Types.ObjectId[];
}
declare const validateCreatePost: (post: Omit<IPost, "user" | "likes">) => Joi.ValidationResult<any>;
declare const validateUpdatePost: (post: Partial<Omit<IPost, "user" | "likes">>) => Joi.ValidationResult<any>;
declare const Post: mongoose.Model<IPost, {}, {}, {}, Document<unknown, {}, IPost, {}, mongoose.DefaultSchemaOptions> & IPost & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPost>;
export { Post, validateCreatePost, validateUpdatePost };
//# sourceMappingURL=Post.d.ts.map