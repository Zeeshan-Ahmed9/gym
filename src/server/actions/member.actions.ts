"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  createMember,
  updateMember,
  deleteMember,
  deactivateMember,
  getMemberDetails,
  type CreateMemberInput,
  type UpdateMemberInput,
} from "@/server/services/member.service";
import type { ActionResult } from "@/types";
import type { MemberDetails } from "@/types/member";
import { auth } from "@/lib/auth";

async function checkAdminAuth(): Promise<boolean> {
  try {
    const session = await auth();
    if (process.env.NODE_ENV === "development" && !session?.user) {
      return true;
    }
    return session?.user?.role === "ADMIN";
  } catch {
    return process.env.NODE_ENV === "development";
  }
}

function safeRevalidate(paths: string[]) {
  try {
    for (const p of paths) {
      revalidatePath(p);
    }
  } catch {
    // outside request scope
  }
}

export async function createMemberAction(
  input: CreateMemberInput
): Promise<ActionResult<{ id: string; memberCode: string; name: string }>> {
  try {
    const isAuth = await checkAdminAuth();
    if (!isAuth) {
      return { success: false, error: "Unauthorized: Admin access required." };
    }

    if (!input.name || !input.name.trim()) {
      return { success: false, error: "Name cannot be empty." };
    }

    if (!input.phone || !input.phone.trim()) {
      return { success: false, error: "Phone cannot be empty." };
    }

    if (input.email && input.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.email.trim())) {
        return { success: false, error: "Please enter a valid email address." };
      }
    }

    if (!input.startDate) {
      return { success: false, error: "Start date is required." };
    }

    if (!input.durationMonths || input.durationMonths <= 0) {
      return { success: false, error: "Duration must be a positive whole number." };
    }

    if (!input.expiryDate) {
      return { success: false, error: "Expiry date is required." };
    }

    const start = new Date(input.startDate);
    const exp = new Date(input.expiryDate);
    if (exp <= start) {
      return { success: false, error: "Expiry date must be after the start date." };
    }

    if (!input.monthlyFee || Number(input.monthlyFee) <= 0) {
      return { success: false, error: "Monthly fee must be greater than zero." };
    }

    const result = await createMember(input);

    safeRevalidate(["/admin/members", "/admin", "/admin/fees"]);

    return {
      success: true,
      data: {
        id: result.member.id,
        memberCode: result.member.memberCode,
        name: result.member.name,
      },
    };
  } catch (error) {
    console.error("Error in createMemberAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create member.",
    };
  }
}

export async function updateMemberAction(
  input: UpdateMemberInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const isAuth = await checkAdminAuth();
    if (!isAuth) {
      return { success: false, error: "Unauthorized: Admin access required." };
    }

    if (!input.name || !input.name.trim()) {
      return { success: false, error: "Name cannot be empty." };
    }

    if (!input.phone || !input.phone.trim()) {
      return { success: false, error: "Phone cannot be empty." };
    }

    if (input.email && input.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.email.trim())) {
        return { success: false, error: "Please enter a valid email address." };
      }
    }

    const updated = await updateMember(input);

    safeRevalidate(["/admin/members", `/admin/members/${input.id}`, "/admin"]);

    return { success: true, data: { id: updated.id } };
  } catch (error) {
    console.error("Error in updateMemberAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update member.",
    };
  }
}

export async function updateMemberSelfAction(input: {
  id: string;
  name: string;
  phone: string;
  email?: string;
}): Promise<ActionResult<{ id: string; name: string; phone: string; email: string }>> {
  try {
    if (!input.id) {
      return { success: false, error: "Member ID is required." };
    }
    if (!input.name || !input.name.trim()) {
      return { success: false, error: "Name cannot be empty." };
    }
    if (!input.phone || !input.phone.trim()) {
      return { success: false, error: "Phone number cannot be empty." };
    }
    if (input.email && input.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.email.trim())) {
        return { success: false, error: "Please enter a valid email address." };
      }
    }

    const updated = await prisma.member.update({
      where: { id: input.id },
      data: {
        name: input.name.trim(),
        phone: input.phone.trim(),
        email: input.email?.trim() ? input.email.trim().toLowerCase() : null,
      },
    });

    safeRevalidate([
      "/member",
      "/member/profile",
      "/member/attendance",
      "/member/progress",
      "/admin/members",
      `/admin/members/${input.id}`,
    ]);

    return {
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        phone: updated.phone || "",
        email: updated.email || "",
      },
    };
  } catch (error) {
    console.error("Error in updateMemberSelfAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile.",
    };
  }
}

export async function deleteMemberAction(
  memberId: string
): Promise<ActionResult<{ id: string }>> {
  try {
    const isAuth = await checkAdminAuth();
    if (!isAuth) {
      return { success: false, error: "Unauthorized: Admin access required." };
    }

    await deleteMember(memberId);

    safeRevalidate(["/admin/members", "/admin", "/admin/fees", "/admin/attendance"]);

    return { success: true, data: { id: memberId } };
  } catch (error) {
    console.error("Error in deleteMemberAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete member.",
    };
  }
}

export async function deactivateMemberAction(
  memberId: string
): Promise<ActionResult<{ id: string }>> {
  try {
    const isAuth = await checkAdminAuth();
    if (!isAuth) {
      return { success: false, error: "Unauthorized: Admin access required." };
    }

    await deactivateMember(memberId);

    safeRevalidate(["/admin/members", `/admin/members/${memberId}`, "/admin"]);

    return { success: true, data: { id: memberId } };
  } catch (error) {
    console.error("Error in deactivateMemberAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to deactivate member.",
    };
  }
}

export async function getMemberDetailsAction(
  memberId: string
): Promise<ActionResult<MemberDetails>> {
  try {
    const details = await getMemberDetails(memberId);
    if (!details) {
      return { success: false, error: "Member not found." };
    }
    return { success: true, data: details };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch member details.",
    };
  }
}
