"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import type { ActionResult } from "@/types";

export interface VerifyGymIdResult {
  memberId: string;
  memberCode: string;
  name: string;
  isActivated: boolean; // true = password already set; false = first time activation
}

/**
 * 1. Verify Gym ID and determine if it's first-time activation or returning login
 */
export async function verifyMemberGymIdAction(
  rawMemberCode: string
): Promise<ActionResult<VerifyGymIdResult>> {
  try {
    const code = rawMemberCode.trim().toUpperCase();
    if (!code) {
      return { success: false, error: "Please enter your Gym ID (e.g. GYM-54110)." };
    }

    const member = await prisma.member.findUnique({
      where: { memberCode: code },
      include: {
        user: true,
      },
    });

    if (!member) {
      return {
        success: false,
        error: `Gym ID '${code}' was not found in our system. Please check your card or contact the front desk.`,
      };
    }

    // Check if the member has an active user account with a set password
    const isActivated = !!(member.user && member.user.password && member.user.password.length > 0);

    return {
      success: true,
      data: {
        memberId: member.id,
        memberCode: member.memberCode,
        name: member.name,
        isActivated,
      },
    };
  } catch (error) {
    console.error("Error in verifyMemberGymIdAction:", error);
    return {
      success: false,
      error: "Unable to verify Gym ID due to a system error. Please try again.",
    };
  }
}

/**
 * 2. First-time Password Setup / Account Activation for Member
 */
export async function setupMemberPasswordAction(input: {
  memberCode: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult<{ memberName: string }>> {
  try {
    const code = input.memberCode.trim().toUpperCase();
    const { password, confirmPassword } = input;

    if (!code) {
      return { success: false, error: "Gym ID is required." };
    }

    if (!password || password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match." };
    }

    const member = await prisma.member.findUnique({
      where: { memberCode: code },
      include: { user: true },
    });

    if (!member) {
      return { success: false, error: "Member not found." };
    }

    // Security check: ensure account is not already activated
    if (member.user && member.user.password) {
      return {
        success: false,
        error: "This Gym ID has already been activated with a password. Please sign in instead.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (member.user) {
      // Update existing linked user
      await prisma.user.update({
        where: { id: member.user.id },
        data: {
          password: hashedPassword,
          role: "MEMBER",
        },
      });
    } else {
      // Create new linked user
      const emailCandidate =
        member.email && member.email.includes("@")
          ? member.email.toLowerCase()
          : `${member.memberCode.toLowerCase()}@fitflow.local`;

      // Ensure email uniqueness if fallback
      const existingUserWithEmail = await prisma.user.findUnique({
        where: { email: emailCandidate },
      });

      const finalEmail = existingUserWithEmail
        ? `${member.memberCode.toLowerCase()}-${Date.now()}@fitflow.local`
        : emailCandidate;

      const newUser = await prisma.user.create({
        data: {
          name: member.name,
          email: finalEmail,
          password: hashedPassword,
          role: "MEMBER",
        },
      });

      await prisma.member.update({
        where: { id: member.id },
        data: { userId: newUser.id },
      });
    }

    // Set secure member session cookie
    const cookieStore = await cookies();
    cookieStore.set("fitflow_member_session", member.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return {
      success: true,
      data: { memberName: member.name },
    };
  } catch (error) {
    console.error("Error in setupMemberPasswordAction:", error);
    return {
      success: false,
      error: "Failed to setup password. Please try again.",
    };
  }
}

/**
 * 3. Sign In with Gym ID + Password
 */
export async function loginMemberWithPasswordAction(input: {
  memberCode: string;
  password: string;
}): Promise<ActionResult<{ memberName: string }>> {
  try {
    const code = input.memberCode.trim().toUpperCase();
    const { password } = input;

    if (!code) {
      return { success: false, error: "Gym ID is required." };
    }

    if (!password) {
      return { success: false, error: "Please enter your password." };
    }

    const member = await prisma.member.findUnique({
      where: { memberCode: code },
      include: { user: true },
    });

    if (!member) {
      return { success: false, error: "Invalid Gym ID or credentials." };
    }

    if (!member.user || !member.user.password) {
      return {
        success: false,
        error: "This Gym ID has not been activated yet. Please verify your Gym ID to set your password.",
      };
    }

    const isValid = await bcrypt.compare(password, member.user.password);
    if (!isValid) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    // Set secure member session cookie
    const cookieStore = await cookies();
    cookieStore.set("fitflow_member_session", member.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return {
      success: true,
      data: { memberName: member.name },
    };
  } catch (error) {
    console.error("Error in loginMemberWithPasswordAction:", error);
    return {
      success: false,
      error: "Authentication failed. Please check your credentials.",
    };
  }
}

/**
 * 4. Member Sign Out
 */
export async function logoutMemberAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("fitflow_member_session");
}
