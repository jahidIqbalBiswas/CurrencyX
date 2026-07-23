import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .transform((val) => val.toLowerCase().trim()),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});

export type LoginInput = z.infer<typeof loginSchema>;
