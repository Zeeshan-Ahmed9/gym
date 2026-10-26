import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names safely with tailwind-merge and clsx.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a numeric amount to localized currency (defaults to USD or local config).
 */
export function formatCurrency(
  amount: number | string,
  currency = "USD",
  locale = "en-US"
): string {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return "$0.00";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(numericAmount);
}

/**
 * Application default timezone: Pakistan Standard Time (PKT, UTC+5)
 */
export const APP_TIMEZONE = process.env.NEXT_PUBLIC_TIMEZONE || "Asia/Karachi";

/**
 * Format date safely using Pakistan timezone by default.
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIMEZONE,
    ...options,
  }).format(d);
}

/**
 * Format a time in Pakistan Standard Time (e.g. 5:30 PM).
 */
export function formatTimePK(date: Date | string | number): string {
  return formatDate(date, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
