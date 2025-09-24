import z from "zod";

const passwordMessage =
  "Password must include at least 8 characters, one number, and one uppercase letter";

export const registerSchema = z
  .object({
    fullName: z
      .string({ required_error: "Full name is required" })
      .trim()
      .min(3, "Please enter your full name"),
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Please enter a valid email"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, passwordMessage)
      .regex(/^(?=.*[A-Z])(?=.*\d).+$/, passwordMessage),
    confirmPassword: z
      .string({ required_error: "Confirm your password" })
      .min(8, "Please confirm your password"),
    acceptTerms: z
      .boolean()
      .refine((value) => value, {
        message: "You must agree to the terms to continue",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
