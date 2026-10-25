import "dotenv/config";
import dns from "node:dns";
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}
import { getPool } from "../src/lib/db";
import {
  ensureAdminCredentialsTable,
  isAdminConfigured,
  createInitialAdminPassword,
  verifyAdminPassword,
  changeAdminPassword,
  getAdminRecord,
} from "../src/server/services/admin-auth.service";
import {
  generateSessionToken,
  validateSessionToken,
} from "../src/server/auth/admin-session";

async function runTests() {
  console.log("=== STARTING ADMIN AUTH TESTS ===");

  // 1. Ensure table
  await ensureAdminCredentialsTable();
  console.log("✅ 1. ensureAdminCredentialsTable passed");

  // 2. Clear any test record for clean test run
  const pool = getPool();
  await pool.query("DELETE FROM admin_credentials WHERE id = 'admin';");
  console.log("Cleared test record");

  // 3. Check configured state when empty
  const configuredBefore = await isAdminConfigured();
  console.log("isAdminConfigured before setup:", configuredBefore, "(Expected: false)");
  if (configuredBefore !== false) throw new Error("Expected false for empty table");
  console.log("✅ 2. isAdminConfigured empty check passed");

  // 4. Initial setup
  const initResult = await createInitialAdminPassword("InitialSecurePass2026!");
  console.log("createInitialAdminPassword result:", initResult);
  if (!initResult.success) throw new Error("Failed to create initial password");
  console.log("✅ 3. createInitialAdminPassword passed");

  // 5. Configured state after setup
  const configuredAfter = await isAdminConfigured();
  console.log("isAdminConfigured after setup:", configuredAfter, "(Expected: true)");
  if (configuredAfter !== true) throw new Error("Expected true after setup");
  console.log("✅ 4. isAdminConfigured true check passed");

  // 6. Verify password - wrong password
  const wrongVerify = await verifyAdminPassword("WrongPassword123");
  console.log("Verify wrong password:", wrongVerify);
  if (wrongVerify.success) throw new Error("Wrong password should not succeed");
  console.log("✅ 5. Wrong password rejected");

  // 7. Verify password - correct password
  const correctVerify = await verifyAdminPassword("InitialSecurePass2026!");
  console.log("Verify correct password:", correctVerify);
  if (!correctVerify.success) throw new Error("Correct password must succeed");
  console.log("✅ 6. Correct password verified");

  // 8. Session token generation and validation
  const token = generateSessionToken();
  const isValid = validateSessionToken(token);
  console.log("Generated token valid:", isValid);
  if (!isValid) throw new Error("Valid token failed validation");

  const tamperedToken = token.slice(0, -4) + "abcd";
  const isTamperedValid = validateSessionToken(tamperedToken);
  console.log("Tampered token valid:", isTamperedValid, "(Expected: false)");
  if (isTamperedValid) throw new Error("Tampered token must be rejected");
  console.log("✅ 7. HMAC session validation & tampering resistance passed");

  // 9. Change password - wrong current password
  const wrongChange = await changeAdminPassword("WrongCurrentPass", "UpdatedPass999!");
  console.log("Change with wrong current pass:", wrongChange);
  if (wrongChange.success) throw new Error("Change with wrong current pass should fail");
  console.log("✅ 8. Change password rejected with invalid current password");

  // 10. Change password - correct current password
  const validChange = await changeAdminPassword("InitialSecurePass2026!", "UpdatedPass999!");
  console.log("Change with correct current pass:", validChange);
  if (!validChange.success) throw new Error("Change with valid pass must succeed");
  console.log("✅ 9. Change password succeeded");

  // 11. Verify old password no longer works
  const oldVerify = await verifyAdminPassword("InitialSecurePass2026!");
  if (oldVerify.success) throw new Error("Old password should no longer work");
  console.log("✅ 10. Old password rejected after change");

  // 12. Verify new password works
  const newVerify = await verifyAdminPassword("UpdatedPass999!");
  if (!newVerify.success) throw new Error("New password must work");
  console.log("✅ 11. New password verified successfully");

  // 13. Data integrity check of all other tables
  const counts = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM users) as users,
      (SELECT COUNT(*) FROM members) as members,
      (SELECT COUNT(*) FROM memberships) as memberships,
      (SELECT COUNT(*) FROM payments) as payments,
      (SELECT COUNT(*) FROM attendances) as attendances,
      (SELECT COUNT(*) FROM progress) as progress,
      (SELECT COUNT(*) FROM gym_settings) as gym_settings,
      (SELECT COUNT(*) FROM admin_credentials) as admin_credentials
  `);
  console.log("\nDatabase Row Counts (Integrity Check):", counts.rows[0]);

  const adminRecord = await getAdminRecord();
  console.log("Current admin record:", {
    id: adminRecord?.id,
    hasHash: Boolean(adminRecord?.password_hash),
    updated_at: adminRecord?.updated_at,
  });

  console.log("\n🎉 ALL ADMIN AUTH TESTS PASSED PERFECTLY!");
  await pool.end();
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
