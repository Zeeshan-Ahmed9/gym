import { z } from "zod";

export const memberCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(7, "Phone number is too short").optional().or(z.literal("")),
  memberCode: z.string().min(3, "Member code must be at least 3 characters"),
});

export const memberUpdateSchema = memberCreateSchema.partial();

export type MemberCreateInput = z.infer<typeof memberCreateSchema>;
export type MemberUpdateInput = z.infer<typeof memberUpdateSchema>;
