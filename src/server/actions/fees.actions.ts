"use server";

import { revalidatePath } from "next/cache";
import { recordPayment, type RecordPaymentInput } from "@/server/services/fees.service";
import type { ActionResult } from "@/types";
import { checkAdminAuth } from "@/server/auth/admin-session";

export async function recordPaymentAction(
  input: RecordPaymentInput
): Promise<ActionResult<{ id: string; amount: number; memberName: string }>> {
  try {
    const isAuth = await checkAdminAuth();
    if (!isAuth) {
      return { success: false, error: "Unauthorized: Admin access required." };
    }

    if (!input.memberId) {
      return { success: false, error: "Member is required." };
    }

    if (!input.amount || Number(input.amount) <= 0) {
      return { success: false, error: "Amount must be greater than zero." };
    }

    if (!input.month) {
      return { success: false, error: "Membership month is required." };
    }

    if (!input.paymentDate) {
      return { success: false, error: "Payment date is required." };
    }

    const payment = await recordPayment(input);

    try {
      revalidatePath("/admin/fees");
      revalidatePath("/admin");
      revalidatePath("/admin/members");
    } catch {
      // ignore outside request scope
    }

    return {
      success: true,
      data: {
        id: payment.id,
        amount: Number(payment.amount),
        memberName: payment.member.name,
      },
    };
  } catch (error) {
    console.error("Error in recordPaymentAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to record payment.",
    };
  }
}
