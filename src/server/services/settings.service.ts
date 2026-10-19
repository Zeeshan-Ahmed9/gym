import { prisma } from "@/lib/db";
import type { GymSettings } from "@/types/settings";

/**
 * Default fallback settings for single-gym owner.
 */
export const DEFAULT_GYM_SETTINGS: GymSettings = {
  gymName: "PulseGym",
  gymLogo: null,
  phone: "+92 300 9876543",
  email: "admin@pulse.fit",
  address: "Plot 42, Commercial Avenue, Phase 5",
  defaultMonthlyFee: 3000,
  defaultMembershipDurationMonths: 1,
};

/**
 * Fetch the active gym configuration settings from Neon PostgreSQL.
 */
export async function getGymSettings(): Promise<GymSettings> {
  try {
    const setting = await prisma.gymSetting.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        gymName: DEFAULT_GYM_SETTINGS.gymName,
        gymLogo: DEFAULT_GYM_SETTINGS.gymLogo,
        phone: DEFAULT_GYM_SETTINGS.phone,
        email: DEFAULT_GYM_SETTINGS.email,
        address: DEFAULT_GYM_SETTINGS.address,
        defaultMonthlyFee: DEFAULT_GYM_SETTINGS.defaultMonthlyFee,
        defaultMembershipDurationMonths: DEFAULT_GYM_SETTINGS.defaultMembershipDurationMonths,
      },
    });

    return {
      gymName: setting.gymName,
      gymLogo: setting.gymLogo,
      phone: setting.phone,
      email: setting.email,
      address: setting.address,
      defaultMonthlyFee: Number(setting.defaultMonthlyFee),
      defaultMembershipDurationMonths: setting.defaultMembershipDurationMonths,
    };
  } catch (error) {
    console.error("Failed to fetch gym settings:", error);
    return DEFAULT_GYM_SETTINGS;
  }
}

/**
 * Update the active gym configuration settings in Neon PostgreSQL.
 */
export async function updateGymSettings(
  newSettings: Partial<GymSettings>
): Promise<GymSettings> {
  try {
    const updated = await prisma.gymSetting.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        gymName: newSettings.gymName ?? DEFAULT_GYM_SETTINGS.gymName,
        gymLogo: newSettings.gymLogo ?? DEFAULT_GYM_SETTINGS.gymLogo,
        phone: newSettings.phone ?? DEFAULT_GYM_SETTINGS.phone,
        email: newSettings.email ?? DEFAULT_GYM_SETTINGS.email,
        address: newSettings.address ?? DEFAULT_GYM_SETTINGS.address,
        defaultMonthlyFee: newSettings.defaultMonthlyFee ?? DEFAULT_GYM_SETTINGS.defaultMonthlyFee,
        defaultMembershipDurationMonths:
          newSettings.defaultMembershipDurationMonths ??
          DEFAULT_GYM_SETTINGS.defaultMembershipDurationMonths,
      },
      update: {
        ...(newSettings.gymName !== undefined && { gymName: newSettings.gymName }),
        ...(newSettings.gymLogo !== undefined && { gymLogo: newSettings.gymLogo }),
        ...(newSettings.phone !== undefined && { phone: newSettings.phone }),
        ...(newSettings.email !== undefined && { email: newSettings.email }),
        ...(newSettings.address !== undefined && { address: newSettings.address }),
        ...(newSettings.defaultMonthlyFee !== undefined && {
          defaultMonthlyFee: newSettings.defaultMonthlyFee,
        }),
        ...(newSettings.defaultMembershipDurationMonths !== undefined && {
          defaultMembershipDurationMonths: newSettings.defaultMembershipDurationMonths,
        }),
      },
    });

    return {
      gymName: updated.gymName,
      gymLogo: updated.gymLogo,
      phone: updated.phone,
      email: updated.email,
      address: updated.address,
      defaultMonthlyFee: Number(updated.defaultMonthlyFee),
      defaultMembershipDurationMonths: updated.defaultMembershipDurationMonths,
    };
  } catch (error) {
    console.error("Failed to update gym settings:", error);
    throw new Error("Unable to save settings to database.");
  }
}

