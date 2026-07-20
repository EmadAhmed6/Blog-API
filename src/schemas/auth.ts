import { z } from "zod";
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must include uppercase, lowercase, and numbers",
  );
const RegisterSchema = z.object({
  username: z.string().min(3).max(10),
  email: z.string().email().trim().min(4),
  password: passwordSchema,
});

const LoginSchema = z.object({
  email: z.string().email().trim().min(4),
  password: passwordSchema,
});

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});
const ResetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

export {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  passwordSchema,
};

export type IRegisterUser = z.infer<typeof RegisterSchema>;
export type ILoginUser = z.infer<typeof LoginSchema>;
export type IForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type IResetPassword = z.infer<typeof ResetPasswordSchema>;
