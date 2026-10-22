"use server";

import { revalidatePath } from "next/cache";
import {
  recordMemberQrCheckIn,
  logMemberWeight,
} from "@/server/services/member-dashboard.service";
import type { ActionResult } from "@/types";

export async function recordQrCheckInAction(
  memberId: string,
  qrCode: string
): Promise<ActionResult<{ checkInTime: string; gate: string }>> {
  try {
    if (!memberId) {
      return { success: false, error: "Member ID is required." };
    }

    if (!qrCode || !qrCode.trim()) {
      return { success: false, error: "Invalid QR code scan." };
    }

    const res = await recordMemberQrCheckIn(memberId, qrCode);

    if (!res.success) {
      return { success: false, error: res.error || "Turnstile check-in failed." };
    }

    try {
      revalidatePath("/member");
      revalidatePath("/member/attendance");
      revalidatePath("/admin/attendance");
      revalidatePath("/admin");
    } catch {
      // outside request scope
    }

    return {
      success: true,
      data: {
        checkInTime: res.checkInTime || "Just now",
        gate: res.gate || "Turnstile Gate 01",
      },
    };
  } catch (error) {
    console.error("Error in recordQrCheckInAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Turnstile check-in failed.",
    };
  }
}

export async function logWeightAction(
  memberId: string,
  weight: number
): Promise<ActionResult<{ weight: number }>> {
  try {
    if (!memberId) {
      return { success: false, error: "Member ID is required." };
    }

    const res = await logMemberWeight(memberId, weight);

    if (!res.success) {
      return { success: false, error: res.error || "Failed to log weight." };
    }

    try {
      revalidatePath("/member");
      revalidatePath("/member/progress");
    } catch {
      // outside request scope
    }

    return {
      success: true,
      data: { weight },
    };
  } catch (error) {
    console.error("Error in logWeightAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to record weight.",
    };
  }
}
