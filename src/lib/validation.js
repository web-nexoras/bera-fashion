import { z } from "zod";
/** Shared validation rules — used by both the forms and the auth BFF. */
const email = z
    .string()
    .trim()
    .min(1, "Email address is required")
    .max(254, "Email address is too long")
    .email("Enter a valid email address");
const bangladeshPhone = z
    .string()
    .trim()
    .regex(/^(?:\+?880|0)1[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number");
export const strongPassword = z
    .string()
    .min(10, "Use at least 10 characters")
    .max(128, "Password is too long")
    .regex(/[a-z]/, "Include a lowercase letter")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/\d/, "Include a number")
    .regex(/[^A-Za-z0-9]/, "Include a special character");
export const loginSchema = z.object({
    email,
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password is too long"),
});
export const registerSchema = z
    .object({
    name: z
        .string()
        .trim()
        .min(2, "Enter at least 2 characters")
        .max(60, "Name is too long")
        .regex(/^[\p{L}][\p{L}\s.'’-]*$/u, "Use letters, spaces, apostrophes or hyphens only"),
    email,
    phone: bangladeshPhone,
    password: strongPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((accepted) => accepted, {
        message: "Please accept the terms to continue",
    }),
})
    .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export const forgotPasswordSchema = z.object({ email });
export const resetPasswordSchema = z
    .object({
    password: strongPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
})
    .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export function firstIssue(error) {
    return error.issues[0]?.message ?? "Please check your details and try again.";
}
