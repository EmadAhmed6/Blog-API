import { z } from "zod";
declare const passwordSchema: z.ZodString;
declare const RegisterSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
declare const ForgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
declare const ResetPasswordSchema: z.ZodObject<{
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export { RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema, passwordSchema, };
export type IRegisterUser = z.infer<typeof RegisterSchema>;
export type ILoginUser = z.infer<typeof LoginSchema>;
export type IForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type IResetPassword = z.infer<typeof ResetPasswordSchema>;
//# sourceMappingURL=auth.d.ts.map