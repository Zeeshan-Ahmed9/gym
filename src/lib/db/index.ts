import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
  adapter: PrismaPg | undefined;
};

export function getPool(): Pool {
  if (!globalForPrisma.pool) {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    // Increase max listeners to prevent memory leak warning during Next.js HMR
    pool.setMaxListeners(50);
    globalForPrisma.pool = pool;
  }
  return globalForPrisma.pool;
}

export function getAdapter(): PrismaPg {
  if (!globalForPrisma.adapter) {
    globalForPrisma.adapter = new PrismaPg(getPool());
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
