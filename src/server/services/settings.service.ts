import { prisma } from "@/lib/db";
import type { GymSettings } from "@/types/settings";

/**
 * Default fallback settings for single-gym owner.
 */
export const DEFAULT_GYM_SETTINGS: GymSettings = {
  gymName: "IronMan Fitness",
  gymLogo: null,
  phone: "+92 300 9876543",
  email: "admin@pulse.fit",
  address: "Plot 42, Commercial Avenue, Phase 5",
  defaultMonthlyFee: 3000,
  defaultMembershipDurationMonths: 1,
};

let cachedSettings: GymSettings | null = null;
let lastSettingsFetchTime = 0;
const SETTINGS_CACHE_TTL = 60 * 1000; // 60 seconds

/**
 * Invalidate in-memory settings cache.
 */
export function invalidateSettingsCache() {
  cachedSettings = null;
  lastSettingsFetchTime = 0;
}

/**
 * Fetch the active gym configuration settings from Neon PostgreSQL (cached).
 */
export async function getGymSettings(): Promise<GymSettings> {
  const now = Date.now();
  if (cachedSettings && now - lastSettingsFetchTime < SETTINGS_CACHE_TTL) {
    return cachedSettings;
  }

  try {
    const setting = await prisma.gymSetting.findUnique({
      where: { id: "default" },
    });

    if (setting) {
      const result: GymSettings = {
        gymName: setting.gymName || DEFAULT_GYM_SETTINGS.gymName,
        gymLogo: setting.gymLogo ?? null,
        phone: setting.phone || DEFAULT_GYM_SETTINGS.phone,
        email: setting.email || DEFAULT_GYM_SETTINGS.email,
        address: setting.address || DEFAULT_GYM_SETTINGS.address,
        defaultMonthlyFee: Number(setting.defaultMonthlyFee || DEFAULT_GYM_SETTINGS.defaultMonthlyFee),
        defaultMembershipDurationMonths: Number(
          setting.defaultMembershipDurationMonths || DEFAULT_GYM_SETTINGS.defaultMembershipDurationMonths
        ),
      };
      cachedSettings = result;
      lastSettingsFetchTime = now;
      return result;
    }

    // If not found yet in DB, create initial row
    const created = await prisma.gymSetting.upsert({
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

    const result: GymSettings = {
      gymName: created.gymName,
      gymLogo: created.gymLogo,
      phone: created.phone,
      email: created.email,
      address: created.address,
      defaultMonthlyFee: Number(created.defaultMonthlyFee),
      defaultMembershipDurationMonths: created.defaultMembershipDurationMonths,
    };
    cachedSettings = result;
    lastSettingsFetchTime = now;
    return result;
  } catch (error) {
    console.error("Failed to fetch gym settings:", error);
    // Return fallback in case DB is momentarily waking up
    return cachedSettings || DEFAULT_GYM_SETTINGS;
  }
}

/**
 * Update the active gym configuration settings in Neon PostgreSQL.
 */
export async function updateGymSettings(
  newSettings: Partial<GymSettings>
): Promise<GymSettings> {
  try {
    const current = await getGymSettings();
    const gymName = newSettings.gymName ?? current.gymName ?? DEFAULT_GYM_SETTINGS.gymName;
    const gymLogo = newSettings.gymLogo !== undefined ? newSettings.gymLogo : current.gymLogo;
    const phone = newSettings.phone ?? current.phone ?? DEFAULT_GYM_SETTINGS.phone;
    const email = newSettings.email ?? current.email ?? DEFAULT_GYM_SETTINGS.email;
    const address = newSettings.address ?? current.address ?? DEFAULT_GYM_SETTINGS.address;
    const defaultMonthlyFee =
      newSettings.defaultMonthlyFee ?? current.defaultMonthlyFee ?? DEFAULT_GYM_SETTINGS.defaultMonthlyFee;
    const defaultMembershipDurationMonths =
      newSettings.defaultMembershipDurationMonths ??
      current.defaultMembershipDurationMonths ??
      DEFAULT_GYM_SETTINGS.defaultMembershipDurationMonths;

    const updated = await prisma.gymSetting.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        gymName,
        gymLogo,
        phone,
        email,
        address,
        defaultMonthlyFee,
        defaultMembershipDurationMonths,
      },
      update: {
        gymName,
        gymLogo,
        phone,
        email,
        address,
        defaultMonthlyFee,
        defaultMembershipDurationMonths,
      },
    });

    const res: GymSettings = {
      gymName: updated.gymName,
      gymLogo: updated.gymLogo,
      phone: updated.phone,
      email: updated.email,
      address: updated.address,
      defaultMonthlyFee: Number(updated.defaultMonthlyFee),
      defaultMembershipDurationMonths: updated.defaultMembershipDurationMonths,
    };
    cachedSettings = res;
    lastSettingsFetchTime = Date.now();
    return res;
  } catch (error) {
    console.error("Failed to update gym settings:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unable to save settings to database."
    );
  }
}

