import { z } from "zod";

export const paymentCreateSchema = z.object({
  memberId: z.string().min(1, "Member is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month format must be YYYY-MM"),
  paymentDate: z.date().default(() => new Date()),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "OTHER"]).default("CASH"),
  status: z.enum(["PAID", "PENDING", "FAILED"]).default("PAID"),
});

export type PaymentCreateInput = z.infer<typeof paymentCreateSchema>;
