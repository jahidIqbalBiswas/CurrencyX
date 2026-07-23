import { z } from "zod/v4";

const envSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required")
    .startsWith("mongodb", "MONGODB_URI must be a valid MongoDB connection string"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters"),

  ADMIN_EMAIL: z
    .string()
    .email("ADMIN_EMAIL must be a valid email address"),

  ADMIN_PASSWORD: z
    .string()
    .min(8, "ADMIN_PASSWORD must be at least 8 characters"),

  EXCHANGE_API_KEY: z
    .string()
    .min(1, "EXCHANGE_API_KEY is required"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = z.prettifyError(parsed.error);
    console.error("❌ Invalid environment variables:\n", formatted);
    throw new Error("Invalid environment variables. Check server logs.");
  }

  return parsed.data;
}

export const env = validateEnv();
