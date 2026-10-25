import bcrypt from "bcryptjs";
import { getPool } from "@/lib/db";

export interface AdminCredentialRecord {
  id: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

const DEFAULT_ADMIN_ID = "admin";

/**
 * Ensure the admin_credentials table exists in Neon PostgreSQL using parameterized DDL.
 */
export async function ensureAdminCredentialsTable(): Promise<void> {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_credentials (
      id TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

/**
 * Fetch the admin credentials record from Neon.
 */
export async function getAdminRecord(
  adminId: string = DEFAULT_ADMIN_ID
): Promise<AdminCredentialRecord | null> {
  const pool = getPool();
  await ensureAdminCredentialsTable();

  const result = await pool.query<AdminCredentialRecord>(
    "SELECT id, password_hash, created_at, updated_at FROM admin_credentials WHERE id = $1 LIMIT 1;",
    [adminId]
  );

  return result.rows[0] || null;
}

/**
 * Check if the admin password is configured.
 * If not configured yet and an ADMIN_PASSWORD environment variable is present,
 * securely auto-initializes the admin record once without hardcoding credentials.
 */
export async function isAdminConfigured(
  adminId: string = DEFAULT_ADMIN_ID
): Promise<boolean> {
  const existing = await getAdminRecord(adminId);
  if (existing) {
    return true;
  }

  // Check for environment variable initial password (e.g. deployed on Vercel)
  const envPassword = process.env.ADMIN_PASSWORD || process.env.INITIAL_ADMIN_PASSWORD;
  if (envPassword && envPassword.trim().length >= 4) {
    try {
      const hashed = await bcrypt.hash(envPassword.trim(), 10);
      const pool = getPool();
      await pool.query(
        `INSERT INTO admin_credentials (id, password_hash, created_at, updated_at)
         VALUES ($1, $2, NOW(), NOW())
         ON CONFLICT (id) DO NOTHING;`,
        [adminId, hashed]
      );
      return true;
    } catch (e) {
      console.error("Failed to initialize admin from environment variable:", e);
    }
  }

  return false;
}

/**
 * Set up the initial admin password.
 * Only allowed if no admin credential exists yet.
 */
export async function createInitialAdminPassword(
  password: string,
  adminId: string = DEFAULT_ADMIN_ID
): Promise<{ success: boolean; error?: string }> {
  if (!password || password.trim().length < 4) {
    return { success: false, error: "Password must be at least 4 characters long." };
  }

  const existing = await getAdminRecord(adminId);
  if (existing) {
    return {
      success: false,
      error: "Admin credentials have already been configured. Please log in or use Change Password.",
    };
  }

  const hashed = await bcrypt.hash(password.trim(), 10);
  const pool = getPool();

  await pool.query(
    `INSERT INTO admin_credentials (id, password_hash, created_at, updated_at)
     VALUES ($1, $2, NOW(), NOW())
     ON CONFLICT (id) DO NOTHING;`,
    [adminId, hashed]
  );

  return { success: true };
}

/**
 * Verify submitted password against the securely hashed password in Neon.
 */
export async function verifyAdminPassword(
  password: string,
  adminId: string = DEFAULT_ADMIN_ID
): Promise<{ success: boolean; error?: string }> {
  if (!password) {
    return { success: false, error: "Please enter your admin password." };
  }

  // Ensure env check has run if empty
  await isAdminConfigured(adminId);

  const record = await getAdminRecord(adminId);
  if (!record || !record.password_hash) {
    return {
      success: false,
      error: "No admin password has been set up yet. Please complete initial setup.",
    };
  }

  const isMatch = await bcrypt.compare(password.trim(), record.password_hash);
  if (!isMatch) {
    return { success: false, error: "Incorrect password. Please try again." };
  }

  return { success: true };
}

/**
 * Change the admin password.
 * Verifies current password first, hashes the new password with bcrypt,
 * and updates the record using a parameterized SQL query.
 */
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
  adminId: string = DEFAULT_ADMIN_ID
): Promise<{ success: boolean; error?: string }> {
  if (!currentPassword) {
    return { success: false, error: "Please enter your current admin password." };
  }

  if (!newPassword || newPassword.trim().length < 4) {
    return { success: false, error: "New password must be at least 4 characters long." };
  }

  const record = await getAdminRecord(adminId);
  if (!record || !record.password_hash) {
    return {
      success: false,
      error: "No admin password found to change. Please complete initial setup.",
    };
  }

  const isCurrentMatch = await bcrypt.compare(currentPassword.trim(), record.password_hash);
  if (!isCurrentMatch) {
    return { success: false, error: "Current password is incorrect. Verification failed." };
  }

  const newHash = await bcrypt.hash(newPassword.trim(), 10);
  const pool = getPool();

  await pool.query(
    `UPDATE admin_credentials 
     SET password_hash = $1, updated_at = NOW() 
     WHERE id = $2;`,
    [newHash, adminId]
  );

  return { success: true };
}
