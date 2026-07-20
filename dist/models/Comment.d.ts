import mongoose, { Document, Types } from "mongoose";
import Joi from "joi";
interface IComment extends Document {
    postId: Types.ObjectId;
    user: Types.ObjectId;
    text: string;
    image: {
        url: string;
        publicId: string | null;
    };
    likes: Types.ObjectId[];
}
declare const validateCreateComment: (comment: IComment) => Joi.ValidationResult<any>;
declare const validateUpdateComment: (comment: Partial<IComment>) => Joi.ValidationResult<any>;
declare const Comment: mongoose.Model<IComment, {}, {}, {}, Document<unknown, {}, IComment, {}, mongoose.DefaultSchemaOptions> & IComment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IComment>;
export { Comment, validateCreateComment, validateUpdateComment };
//# sourceMappingURL=Comment.d.ts.map