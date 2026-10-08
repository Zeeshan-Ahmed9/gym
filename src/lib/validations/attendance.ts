import { z } from "zod";

export const attendanceCheckInSchema = z.object({
  memberCode: z.string().min(1, "Member code is required"),
  method: z.enum(["QR", "MEMBER_CODE"]).default("QR"),
});

export type AttendanceCheckInInput = z.infer<typeof attendanceCheckInSchema>;
