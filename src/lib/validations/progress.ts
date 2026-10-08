import { z } from "zod";

export const progressCreateSchema = z.object({
  memberId: z.string().min(1, "Member is required"),
  date: z.date().default(() => new Date()),
  weight: z.number().positive().optional(),
  chest: z.number().positive().optional(),
  waist: z.number().positive().optional(),
  arms: z.number().positive().optional(),
});

export type ProgressCreateInput = z.infer<typeof progressCreateSchema>;
