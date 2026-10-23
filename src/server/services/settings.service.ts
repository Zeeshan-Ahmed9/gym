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

interface GymSettingDelegate {
  upsert: (args: {
    where: { id: string };
    create: Record<string, unknown>;
    update: Record<string, unknown>;
  }) => Promise<{
    gymName: string;
    gymLogo: string | null;
    phone: string;
    email: string;
    address: string;
    defaultMonthlyFee: number | string | { toString(): string };
    defaultMembershipDurationMonths: number;
  }>;
}

function getGymSettingDelegate(): GymSettingDelegate | null {
  const p = prisma as unknown as { gymSetting?: GymSettingDelegate };
  if (p && p.gymSetting && typeof p.gymSetting.upsert === "function") {
    return p.gymSetting;
  }
  return null;
}

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
    // Read-only SQL query without write transaction overhead
    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT * FROM gym_settings WHERE id = 'default' LIMIT 1;`
    );

    if (rows && rows.length > 0) {
      const row = rows[0] as {
        gymName?: string;
        gymLogo?: string | null;
        phone?: string;
        email?: string;
        address?: string;
        defaultMonthlyFee?: number | string;
        defaultMembershipDurationMonths?: number;
      };
      const result: GymSettings = {
        gymName: row.gymName || DEFAULT_GYM_SETTINGS.gymName,
        gymLogo: row.gymLogo ?? null,
        phone: row.phone || DEFAULT_GYM_SETTINGS.phone,
        email: row.email || DEFAULT_GYM_SETTINGS.email,
        address: row.address || DEFAULT_GYM_SETTINGS.address,
        defaultMonthlyFee: Number(row.defaultMonthlyFee || DEFAULT_GYM_SETTINGS.defaultMonthlyFee),
        defaultMembershipDurationMonths: Number(
          row.defaultMembershipDurationMonths || DEFAULT_GYM_SETTINGS.defaultMembershipDurationMonths
        ),
      };
      cachedSettings = result;
      lastSettingsFetchTime = now;
      return result;
    }

    // If not found yet, initialize once
    const delegate = getGymSettingDelegate();
    if (delegate) {
      const setting = await delegate.upsert({
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
        gymName: setting.gymName,
        gymLogo: setting.gymLogo,
        phone: setting.phone,
        email: setting.email,
        address: setting.address,
        defaultMonthlyFee: Number(setting.defaultMonthlyFee),
        defaultMembershipDurationMonths: setting.defaultMembershipDurationMonths,
      };
      cachedSettings = result;
      lastSettingsFetchTime = now;
      return result;
    }

    cachedSettings = DEFAULT_GYM_SETTINGS;
    lastSettingsFetchTime = now;
    return DEFAULT_GYM_SETTINGS;
  } catch (error) {
    console.error("Failed to fetch gym settings:", error);
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

    const delegate = getGymSettingDelegate();
    if (delegate) {
      const updated = await delegate.upsert({
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
    }

    // Direct SQL fallback if Prisma model is not yet attached to the client instance
    await prisma.$executeRawUnsafe(
      `INSERT INTO gym_settings (id, "gymName", "gymLogo", phone, email, address, "defaultMonthlyFee", "defaultMembershipDurationMonths", "updatedAt")
       VALUES ('default', $1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (id) DO UPDATE SET
         "gymName" = EXCLUDED."gymName",
         "gymLogo" = EXCLUDED."gymLogo",
         phone = EXCLUDED.phone,
         email = EXCLUDED.email,
         address = EXCLUDED.address,
         "defaultMonthlyFee" = EXCLUDED."defaultMonthlyFee",
         "defaultMembershipDurationMonths" = EXCLUDED."defaultMembershipDurationMonths",
         "updatedAt" = NOW();`,
      gymName,
      gymLogo,
      phone,
      email,
      address,
      defaultMonthlyFee,
      defaultMembershipDurationMonths
    );

    const res: GymSettings = {
      gymName,
      gymLogo,
      phone,
      email,
      address,
      defaultMonthlyFee: Number(defaultMonthlyFee),
      defaultMembershipDurationMonths: Number(defaultMembershipDurationMonths),
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
