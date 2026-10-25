import dns from "node:dns";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Force IPv4 first to prevent Windows DNS IPv6 blackhole / 30-40s timeout on Neon AWS endpoints
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
  adapter: PrismaPg | undefined;
};

export function getPool(): Pool {
  if (!globalForPrisma.pool) {
    const connectionString =
      process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
    const pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000, // 30s for serverless Neon compute cold-start resume
      keepAlive: true,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    pool.on("error", (err) => {
      console.warn("Neon PostgreSQL pool idle client warning:", err.message);
    });

    // Increase max listeners to prevent memory leak warning during Next.js HMR
    pool.setMaxListeners(50);
    globalForPrisma.pool = pool;
  }
  return globalForPrisma.pool;
}

export function getAdapter(): PrismaPg {
  if (!globalForPrisma.adapter) {
    globalForPrisma.adapter = new PrismaPg(getPool(), { schema: "public" });
  }
  return globalForPrisma.adapter;
}

export function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    adapter: getAdapter(),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
