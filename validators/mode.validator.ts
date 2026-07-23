import { z } from "zod/v4";

export const switchModeSchema = z.object({
  mode: z.enum(["manual", "live"], {
    message: "Mode must be either 'manual' or 'live'",
  }),
});

export type SwitchModeInput = z.infer<typeof switchModeSchema>;
