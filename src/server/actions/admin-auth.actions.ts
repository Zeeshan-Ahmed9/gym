"use server";

import { revalidatePath } from "next/cache";
import {
  isAdminConfigured,
  createInitialAdminPassword,
  verifyAdminPassword,
  changeAdminPassword,
} from "@/server/services/admin-auth.service";
import {
  setAdminSessionCookie,
  clearAdminSessionCookie,
  verifyAdminSession,
} from "@/server/auth/admin-session";

export interface AdminAuthStatus {
  isConfigured: boolean;
  isAuthenticated: boolean;
}

/**
 * Check whether an admin password has been initialized in Neon
 * and whether the current session is authenticated.
 */
export async function getAdminAuthStatusAction(): Promise<AdminAuthStatus> {
  try {
    const [isConfigured, isAuthenticated] = await Promise.all([
      isAdminConfigured(),
      verifyAdminSession(),
    ]);

    return {
      isConfigured,
      isAuthenticated,
    };
  } catch (error) {
    console.error("Failed to query admin auth status:", error);
    return {
      isConfigured: false,
      isAuthenticated: false,
    };
  }
}

/**
 * Handle admin login from the private route.
 */
export async function adminLoginAction(
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const verification = await verifyAdminPassword(password);
    if (!verification.success) {
      return verification;
    }

    await setAdminSessionCookie();

    try {
      revalidatePath("/admin");
    } catch {
      // outside request scope
    }

    return { success: true };
  } catch (error) {
    console.error("Admin login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Authentication error occurred.",
    };
  }
}

/**
 * Handle initial one-time password setup when no password exists yet.
 */
export async function adminInitialSetupAction(
  password: string,
  confirmPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!password || password.trim().length < 4) {
      return { success: false, error: "Password must be at least 4 characters long." };
    }

    if (password !== confirmPassword) {
      return { success: false, error: "New password and confirmation do not match." };
    }

    const created = await createInitialAdminPassword(password.trim());
    if (!created.success) {
      return created;
    }

    await setAdminSessionCookie();

    try {
      revalidatePath("/admin");
    } catch {
      // outside request scope
    }

    return { success: true };
  } catch (error) {
    console.error("Admin initial setup error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Setup error occurred.",
    };
  }
}

/**
 * Change the admin password from within the admin settings.
 */
export async function adminChangePasswordAction(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!currentPassword) {
      return { success: false, error: "Please enter your current admin password." };
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, error: "New password must be at least 4 characters long." };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "New password and confirmation do not match." };
    }

    if (currentPassword === newPassword) {
      return {
        success: false,
        error: "New password must be different from your current password.",
      };
    }

    const changed = await changeAdminPassword(currentPassword, newPassword.trim());
    if (!changed.success) {
      return changed;
    }

    // Refresh active session
    await setAdminSessionCookie();

    try {
      revalidatePath("/admin/settings");
    } catch {
      // outside request scope
    }

    return { success: true };
  } catch (error) {
    console.error("Admin change password error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update admin password.",
    };
  }
}

/**
 * Log out and clear the admin session cookie.
 */
export async function adminLogoutAction(): Promise<{ success: boolean }> {
  await clearAdminSessionCookie();
  return { success: true };
}
