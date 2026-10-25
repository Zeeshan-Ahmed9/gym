"use server";

import { revalidatePath } from "next/cache";
import { updateGymSettings } from "@/server/services/settings.service";
import type { GymSettings } from "@/types/settings";
import type { ActionResult } from "@/types";
import { checkAdminAuth } from "@/server/auth/admin-session";

export async function updateSettingsAction(
  newSettings: Partial<GymSettings>
): Promise<ActionResult<GymSettings>> {
  try {
    const isAuth = await checkAdminAuth();
    if (!isAuth) {
      return { success: false, error: "Unauthorized: Admin access required." };
    }

    if (newSettings.gymName !== undefined && !newSettings.gymName.trim()) {
      return { success: false, error: "Gym Name cannot be empty." };
    }

    if (newSettings.phone !== undefined && !newSettings.phone.trim()) {
      return { success: false, error: "Phone Number cannot be empty." };
    }

    if (newSettings.defaultMonthlyFee !== undefined && Number(newSettings.defaultMonthlyFee) <= 0) {
      return { success: false, error: "Default Monthly Fee must be greater than zero." };
    }

    if (
      newSettings.defaultMembershipDurationMonths !== undefined &&
      Number(newSettings.defaultMembershipDurationMonths) <= 0
    ) {
      return { success: false, error: "Default Membership Duration must be at least 1 month." };
    }

    const updated = await updateGymSettings(newSettings);
    try {
      revalidatePath("/admin/settings");
      revalidatePath("/admin");
    } catch {
      // ignore outside request scope
    }

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error in updateSettingsAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update settings.",
    };
  }
}
