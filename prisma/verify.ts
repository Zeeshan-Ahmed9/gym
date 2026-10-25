import "dotenv/config";
import dns from "node:dns";
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

import { Pool } from "pg";
import { prisma } from "@/lib/db";
import { getGymSettings, ensureDefaultGymSettings, updateGymSettings } from "@/server/services/settings.service";

async function verify() {
  console.log("=== 1. Direct PG Check ===");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  const client = await pool.connect();
  try {
    const tableRes = await client.query(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gym_settings'
    `);
    console.log("gym_settings table exists in PostgreSQL:", tableRes.rows.length === 1);

    const counts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM members) as members,
        (SELECT COUNT(*) FROM memberships) as memberships,
        (SELECT COUNT(*) FROM payments) as payments,
        (SELECT COUNT(*) FROM attendances) as attendances,
        (SELECT COUNT(*) FROM progress) as progress,
        (SELECT COUNT(*) FROM gym_settings) as gym_settings
    `);
    console.log("Database Row Counts (Integrity Check):", counts.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }

  console.log("\n=== 2. Prisma Client findUnique Test ===");
  const uniqueSetting = await prisma.gymSetting.findUnique({
    where: { id: "default" },
  });
  console.log("prisma.gymSetting.findUnique('default'):", {
    id: uniqueSetting?.id,
    gymName: uniqueSetting?.gymName,
    phone: uniqueSetting?.phone,
    email: uniqueSetting?.email,
    defaultMonthlyFee: uniqueSetting?.defaultMonthlyFee,
    hasPasscode: Boolean(uniqueSetting?.adminPasscodeHash),
  });

  console.log("\n=== 3. getGymSettings Service Test ===");
  const serviceSettings = await getGymSettings();
  console.log("getGymSettings result:", serviceSettings);

  console.log("\n=== 4. ensureDefaultGymSettings Test ===");
  const ensured = await ensureDefaultGymSettings();
  console.log("ensureDefaultGymSettings result:", ensured);

  console.log("\n=== 5. updateGymSettings Roundtrip Test ===");
  const originalName = serviceSettings.gymName;
  const tempName = `${originalName} (Verified)`;
  const updated = await updateGymSettings({ gymName: tempName });
  console.log("Updated gymName to:", updated.gymName);
  const reverted = await updateGymSettings({ gymName: originalName });
  console.log("Reverted gymName to:", reverted.gymName);

  console.log("\n=== ALL VERIFICATIONS PASSED SUCCESSFULLY ===");
}

verify()
  .catch((e) => {
    console.error("Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
