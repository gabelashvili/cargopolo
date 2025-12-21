import { z } from "zod";

export const schema = z.object({
  auction: z.object({
    cost: z.number().min(0, "Cost must be at least 0"),
    feeType: z.enum(["low", "high"]),
    auction: z.enum(["iaai", "copart"]),
  }),
});

export type FormData = z.infer<typeof schema>;
