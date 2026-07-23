import { z } from "zod/v4";

export const manualRateSchema = z.object({
  rate: z
    .number()
    .positive("Rate must be a positive number")
    .max(999999, "Rate exceeds maximum allowed value")
    .transform((val) => Math.round(val * 100) / 100),
});

export type ManualRateInput = z.infer<typeof manualRateSchema>;
