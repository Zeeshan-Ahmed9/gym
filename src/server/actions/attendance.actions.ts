"use server";

import { revalidatePath } from "next/cache";
import { recordManualCheckIn } from "@/server/services/attendance.service";
import { prisma } from "@/lib/db";
import type { Payment } from "@prisma/client";
import type { ActionResult } from "@/types";
import { checkAdminAuth } from "@/server/auth/admin-session";
import { format, isBefore, startOfDay, endOfDay } from "date-fns";

export async function findMemberForCheckInAction(
  memberCode: string
): Promise<
  ActionResult<{
    name: string;
    code: string;
    membershipStatus: string;
    expiryDate: string;
    feeStatus: string;
    checkInTime: string;
    alreadyCheckedInToday?: boolean;
    alreadyCheckedInTime?: string;
  }>
> {
  try {
    const code = memberCode.trim().toUpperCase();
    if (!code) {
      return { success: false, error: "Please enter a member code." };
    }

    const member = await prisma.member.findUnique({
      where: { memberCode: code },
      include: {
        memberships: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        payments: {
          where: { status: "PAID" },
        },
      },
    });

    if (!member) {
      return { success: false, error: "Member not found" };
    }

    const now = new Date();
    const currentMonthKey = format(now, "yyyy-MM");

    const latest = member.memberships[0];
    let isExpired = true;
    let expiryDateStr = "No Plan";

    if (latest) {
      const exp = new Date(latest.expiryDate);
      isExpired = latest.status !== "ACTIVE" || isBefore(exp, now);
      expiryDateStr = format(exp, "dd MMM yyyy");
    }

    const hasPaid = member.payments.some((p: Payment) => p.month === currentMonthKey);

    // Check if already checked in today
    const existing = await prisma.attendance.findFirst({
      where: {
        memberId: member.id,
        checkInTime: {
          gte: startOfDay(now),
          lte: endOfDay(now),
        },
      },
      orderBy: { checkInTime: "desc" },
    });

    return {
      success: true,
      data: {
        name: member.name,
        code: member.memberCode,
        membershipStatus: isExpired ? "Expired" : "Active",
        expiryDate: expiryDateStr,
        feeStatus: hasPaid ? "Paid" : "Due",
        checkInTime: `Today • ${format(now, "h:mm a")}`,
        alreadyCheckedInToday: !!existing,
        alreadyCheckedInTime: existing
          ? format(new Date(existing.checkInTime), "h:mm a")
          : undefined,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to find member.",
    };
  }
}

export async function recordAttendanceAction(
  memberCode: string
): Promise<
  ActionResult<{
    id: string;
    name: string;
    code: string;
    membershipStatus: string;
    expiryDate: string;
    checkInTime: string;
  }>
> {
  try {
    const isAuth = await checkAdminAuth();
    if (!isAuth) {
      return { success: false, error: "Unauthorized: Admin access required." };
    }

    const result = await recordManualCheckIn(memberCode);

    try {
      revalidatePath("/admin/attendance");
      revalidatePath("/admin");
    } catch {
      // ignore outside request scope
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to record attendance.",
    };
  }
}
