import type { GymSettings } from "@/types/settings";

/**
 * Default fallback settings for single-gym owner.
 * Clearly identified demo defaults structured for seamless database replacement.
 */
export const DEFAULT_GYM_SETTINGS: GymSettings = {
  gymName: "IronPulse Gym",
  gymLogo: null,
  phone: "+92 300 9876543",
  email: "admin@ironpulse.fit",
  address: "Plot 42, Commercial Avenue, Phase 5",
  defaultMonthlyFee: 3000,
  defaultMembershipDurationMonths: 1,
};

// In-memory demo store for current server lifecycle
let currentSettings: GymSettings = { ...DEFAULT_GYM_SETTINGS };

/**
 * Fetch the active gym configuration settings.
 */
export async function getGymSettings(): Promise<GymSettings> {
  // Direct extension point: Query Prisma `GymSettings` model if connected.
  return { ...currentSettings };
}

/**
 * Update the active gym configuration settings.
 */
export async function updateGymSettings(
  newSettings: Partial<GymSettings>
): Promise<GymSettings> {
  // Direct extension point: Persist to Prisma `GymSettings` model if connected.
  currentSettings = {
    ...currentSettings,
    ...newSettings,
  };
  return { ...currentSettings };
}
