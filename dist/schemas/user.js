import { z } from "zod";
import { passwordSchema } from "./auth.js";
const UpdateUserSchema = z
    .object({
    username: z.string().trim().min(3).max(10),
    email: z.string().email().trim().min(4),
    password: passwordSchema,
    image: z
        .object({
        url: z.string().url(),
        publicId: z.string().nullable(),
    })
        .optional(),
})
    .partial();
export { UpdateUserSchema };
//# sourceMappingURL=user.js.map