import "dotenv/config";
import dns from "node:dns";
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}
import bcrypt from "bcryptjs";
import { getPool } from "../src/lib/db";

async function main() {
  const args = process.argv.slice(2);
  const password = args[0] || process.env.ADMIN_PASSWORD;

  if (!password || password.trim().length < 4) {
    console.error("Usage: npx tsx scripts/set-admin-password.ts <new_password>");
    console.error("Or set ADMIN_PASSWORD in your .env file.");
    process.exit(1);
  }

  const pool = getPool();

  console.log("Connecting to Neon PostgreSQL...");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_credentials (
      id TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const hashed = await bcrypt.hash(password.trim(), 10);

  await pool.query(
    `INSERT INTO admin_credentials (id, password_hash, created_at, updated_at)
     VALUES ('admin', $1, NOW(), NOW())
     ON CONFLICT (id) DO UPDATE 
     SET password_hash = EXCLUDED.password_hash, updated_at = NOW();`,
    [hashed]
  );

  console.log("✅ Admin master password successfully set in Neon PostgreSQL table 'admin_credentials'.");
  console.log("You can now access your admin panel at: /control-panel-7x9k");

  await pool.end();
}

main().catch((err) => {
  console.error("Error setting admin password:", err);
  process.exit(1);
});
