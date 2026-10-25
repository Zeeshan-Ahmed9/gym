import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const ADMIN_COOKIE_NAME = "ironman_admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

function getSessionSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    "ironman-gym-admin-secure-fallback-secret-key-32b"
  );
}

/**
 * Generate a cryptographically signed HMAC token for the admin session.
 */
export function generateSessionToken(): string {
  const expiresAt = Date.now() + COOKIE_MAX_AGE * 1000;
  const payload = `admin:${expiresAt}`;
  const hmac = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${hmac}`;
}

/**
 * Validate the admin session token against tampering and expiration.
 */
export function validateSessionToken(token?: string | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, hmac] = parts;
  const expectedHmac = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");

  try {
    const hmacBuf = Buffer.from(hmac, "hex");
    const expectedBuf = Buffer.from(expectedHmac, "hex");
    if (hmacBuf.length !== expectedBuf.length) {
      return false;
    }
    if (!crypto.timingSafeEqual(hmacBuf, expectedBuf)) {
      return false;
    }
  } catch {
    return false;
  }

  const [id, expiresAtStr] = payload.split(":");
  if (id !== "admin") return false;

  const expiresAt = Number(expiresAtStr);
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  return true;
}

/**
 * Establish the admin session HTTP-only cookie.
 */
export async function setAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const token = generateSessionToken();

  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

/**
 * Destroy the admin session cookie upon logout.
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

/**
 * Verify whether the current browser request has a valid active admin session.
 */
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return validateSessionToken(token);
  } catch {
    return false;
  }
}

/**
 * Server-side guard: enforce admin authentication on protected pages.
 * Redirects unauthorized requests to the private login route.
 */
export async function requireAdminSession(): Promise<void> {
  const isAuthorized = await verifyAdminSession();
  if (!isAuthorized) {
    redirect("/control-panel-7x9k");
  }
}

/**
 * Combined authorization check for backend admin server actions.
 * Returns true if the user has an active private admin session cookie
 * OR an authenticated NextAuth session with ADMIN role.
 */
export async function checkAdminAuth(): Promise<boolean> {
  try {
    // 1. Primary: Verify private admin session cookie (from /control-panel-7x9k)
    const isAdminCookieValid = await verifyAdminSession();
    if (isAdminCookieValid) {
      return true;
    }

    // 2. Secondary: Check NextAuth session for backwards compatibility
    const session = await auth();
    if (session?.user?.role === "ADMIN") {
      return true;
    }

    // 3. Fallback for development if no session is set
    if (process.env.NODE_ENV === "development" && !session?.user) {
      return true;
    }

    return false;
  } catch {
    return process.env.NODE_ENV === "development";
  }
}

