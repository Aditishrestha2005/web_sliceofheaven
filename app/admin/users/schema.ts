import { z } from "zod";

export const UserSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Enter a valid email"),
    phoneNumber: z.string().min(7, "Phone number is required"),

    // default makes INPUT optional
    role: z.enum(["user", "admin"]).default("user"),

    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(6, "Minimum 6 characters"),

    image: z.any().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });


export type UserFormValues = z.input<typeof UserSchema>;

export type UserData = z.infer<typeof UserSchema>;
