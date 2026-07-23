import { z } from "zod/v4";
import { HISTORY_PAGE_SIZE } from "@/constants";

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(HISTORY_PAGE_SIZE),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
