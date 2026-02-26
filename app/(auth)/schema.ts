import { z } from "zod";

/* ---------- LOGIN ---------- */
export const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Minimum 6 characters" }),
});

export type LoginData = z.infer<typeof loginSchema>;

/* ---------- REGISTER ---------- */
export const registerSchema = z
  .object({
    fullName: z.string().min(2, { message: "Enter your full name" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Enter a valid email" }),
    phoneNumber: z
      .string()
      .min(7, { message: "Enter a valid phone number" })
      .max(15, { message: "Enter a valid phone number" }),
    password: z.string().min(6, { message: "Minimum 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Minimum 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterData = z.infer<typeof registerSchema>;

export const forgetPasswordSchema = z.object({
   email: z.string().email({ message: "Enter a valid email" }),
});
export type ForgetPasswordData = z.infer<typeof forgetPasswordSchema>;


export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, { message: "Minimum 6 characters" }),
    confirmNewPassword: z.string().min(6, { message: "Minimum 6 characters" }),
}).refine((v) => v.newPassword === v.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
});

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;