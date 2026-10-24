"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const ADMIN_COOKIE_NAME = "ironman_admin_unlocked";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export interface AdminPasscodeStatus {
  isConfigured: boolean;
  isUnlocked: boolean;
}

/**
 * Fetch the current admin passcode status:
 * - isConfigured: true if a passcode hash is stored in gym_settings
 * - isUnlocked: true if current browser session has the unlock cookie
 */
export async function getAdminPasscodeStatus(): Promise<AdminPasscodeStatus> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    const isUnlocked = token === "authorized";

    const rows = await prisma.$queryRawUnsafe<{ adminPasscodeHash: string | null }[]>(
      `SELECT "adminPasscodeHash" FROM gym_settings WHERE id = 'default' LIMIT 1;`
    );

    const isConfigured = Boolean(rows && rows.length > 0 && rows[0]?.adminPasscodeHash);

    return {
      isConfigured,
      isUnlocked,
    };
  } catch (error) {
    console.error("Failed to fetch admin passcode status:", error);
    return {
      isConfigured: false,
      isUnlocked: false,
    };
  }
}

/**
 * Create initial admin passcode (only allowed if not yet configured)
 */
export async function createAdminPasscodeAction(
  passcode: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!passcode || passcode.trim().length < 4) {
      return { success: false, error: "Passcode must be at least 4 characters long." };
    }

    const rows = await prisma.$queryRawUnsafe<{ adminPasscodeHash: string | null }[]>(
      `SELECT "adminPasscodeHash" FROM gym_settings WHERE id = 'default' LIMIT 1;`
    );

    if (rows && rows.length > 0 && rows[0]?.adminPasscodeHash) {
      return {
        success: false,
        error: "An admin passcode is already configured. Use Change Passcode instead.",
      };
    }

    const hashed = await bcrypt.hash(passcode.trim(), 10);

    await prisma.$executeRawUnsafe(
      `INSERT INTO gym_settings (id, "adminPasscodeHash", "updatedAt")
       VALUES ('default', $1, NOW())
       ON CONFLICT (id) DO UPDATE SET
         "adminPasscodeHash" = EXCLUDED."adminPasscodeHash",
         "updatedAt" = NOW();`,
      hashed
    );

    // Set authentication cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, "authorized", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    try {
      revalidatePath("/admin");
    } catch {
      // outside request scope
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating admin passcode:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create passcode.",
    };
  }
}

/**
 * Verify admin passcode to unlock session
 */
export async function verifyAdminPasscodeAction(
  passcode: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!passcode) {
      return { success: false, error: "Please enter your admin passcode." };
    }

    const rows = await prisma.$queryRawUnsafe<{ adminPasscodeHash: string | null }[]>(
      `SELECT "adminPasscodeHash" FROM gym_settings WHERE id = 'default' LIMIT 1;`
    );

    if (!rows || rows.length === 0 || !rows[0]?.adminPasscodeHash) {
      return {
        success: false,
        error: "No admin passcode has been created yet. Please set up a passcode first.",
      };
    }

    const hash = rows[0].adminPasscodeHash;
    const isMatch = await bcrypt.compare(passcode.trim(), hash);

    if (!isMatch) {
      return { success: false, error: "Incorrect passcode. Please try again." };
    }

    // Grant access with session cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, "authorized", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    try {
      revalidatePath("/admin");
    } catch {
      // outside request scope
    }

    return { success: true };
  } catch (error) {
    console.error("Error verifying admin passcode:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Verification error.",
    };
  }
}

/**
 * Change admin passcode:
 * Requires previous passcode verification first.
 */
export async function changeAdminPasscodeAction(
  previousPasscode: string,
  newPasscode: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!previousPasscode) {
      return {
        success: false,
        error: "Pehle pechla pass dalo (Please enter your current previous passcode).",
      };
    }

    if (!newPasscode || newPasscode.trim().length < 4) {
      return {
        success: false,
        error: "New passcode must be at least 4 characters long.",
      };
    }

    const rows = await prisma.$queryRawUnsafe<{ adminPasscodeHash: string | null }[]>(
      `SELECT "adminPasscodeHash" FROM gym_settings WHERE id = 'default' LIMIT 1;`
    );

    if (!rows || rows.length === 0 || !rows[0]?.adminPasscodeHash) {
      return {
        success: false,
        error: "No existing passcode found to change. Please create one first.",
      };
    }

    const currentHash = rows[0].adminPasscodeHash;
    const isPreviousMatch = await bcrypt.compare(previousPasscode.trim(), currentHash);

    if (!isPreviousMatch) {
      return {
        success: false,
        error: "Previous passcode is incorrect! Access denied.",
      };
    }

    // Hash the new passcode
    const newHash = await bcrypt.hash(newPasscode.trim(), 10);

    await prisma.$executeRawUnsafe(
      `UPDATE gym_settings SET "adminPasscodeHash" = $1, "updatedAt" = NOW() WHERE id = 'default';`,
      newHash
    );

    // Refresh cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, "authorized", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    try {
      revalidatePath("/admin");
    } catch {
      // outside request scope
    }

    return { success: true };
  } catch (error) {
    console.error("Error changing admin passcode:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to change passcode.",
    };
  }
}

/**
 * Lock the admin session (logout of admin gate)
 */
export async function lockAdminSessionAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
    return { success: true };
  } catch (error) {
    console.error("Error locking admin session:", error);
    return { success: false };
  }
}
