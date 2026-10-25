import "dotenv/config";
import dns from "node:dns";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables.");
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Ensuring default gym settings exist in database...");

  const settings = await prisma.gymSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      gymName: "IronMan Fitness",
      phone: "+92 300 9876543",
      email: "admin@pulse.fit",
      address: "Plot 42, Commercial Avenue, Phase 5",
      defaultMonthlyFee: 3000,
      defaultMembershipDurationMonths: 1,
    },
  });

  console.log("Default gym settings verified successfully:", {
    id: settings.id,
    gymName: settings.gymName,
    phone: settings.phone,
    email: settings.email,
  });
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
