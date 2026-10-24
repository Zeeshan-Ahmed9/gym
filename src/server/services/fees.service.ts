import { prisma } from "@/lib/db";
import type {
  FeeRecord,
  FeesSummaryData,
  DemoMemberOption,
  PaymentMethodType,
  FeeStatusType,
} from "@/types/fees";
import { format, isBefore } from "date-fns";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "M";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Fetch fees and payment summary metrics from Neon PostgreSQL.
 */
export async function getFeesSummary(): Promise<FeesSummaryData> {
  try {
    const now = new Date();
    const currentMonthKey = format(now, "yyyy-MM");

    const [monthPayments, members] = await Promise.all([
      prisma.payment.findMany({
        where: {
          month: currentMonthKey,
          status: "PAID",
        },
        select: { amount: true },
      }),
      prisma.member.findMany({
        include: {
          memberships: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          payments: {
            where: {
              month: currentMonthKey,
              status: "PAID",
            },
          },
        },
      }),
    ]);

    const collectedMonth = monthPayments.reduce<number>(
      (sum, p) => sum + Number(p.amount),
      0
    );
    const collectedCount = monthPayments.length;

    let pendingDues = 0;
    let dueSoonCount = 0;
    let overdueCount = 0;

    for (const member of members) {
      const latest = member.memberships[0];
      if (!latest) continue;

      const hasPaid = member.payments.length > 0;
      if (!hasPaid) {
        const fee = Number(latest.monthlyFee);
        pendingDues += fee;

        const isExpired =
          latest.status !== "ACTIVE" || isBefore(new Date(latest.expiryDate), now);

        if (isExpired) {
          overdueCount++;
        } else {
          dueSoonCount++;
        }
      }
    }

    const totalExpected = collectedMonth + pendingDues;
    const realizationRate =
      totalExpected > 0 ? Math.round((collectedMonth / totalExpected) * 100) : 100;

    return {
      collectedMonth,
      collectedCount,
      pendingDues,
      dueSoonCount,
      overdueCount,
      totalExpected,
      targetAmount: totalExpected,
      realizationRate,
    };
  } catch (error) {
    console.error("Failed to fetch fees summary:", error);
    return {
      collectedMonth: 0,
      collectedCount: 0,
      pendingDues: 0,
      dueSoonCount: 0,
      overdueCount: 0,
      totalExpected: 0,
      targetAmount: 0,
      realizationRate: 0,
    };
  }
}

/**
 * Fetch real registered members for recording fees.
 */
export async function getDemoMembers(): Promise<DemoMemberOption[]> {
  try {
    const members = await prisma.member.findMany({
      include: {
        memberships: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
    });

    return members.map((m) => {
      const latest = m.memberships[0];
      return {
        id: m.id,
        name: m.name,
        code: m.memberCode,
        tier: latest ? `Monthly (Rs. ${Number(latest.monthlyFee).toLocaleString()})` : "General Member",
        defaultAmount: latest ? Number(latest.monthlyFee) : 3000,
      };
    });
  } catch (error) {
    console.error("Failed to fetch members for fees:", error);
    return [];
  }
}

/**
 * Fetch actual payment records and active due records from Neon PostgreSQL.
 */
export async function getFeeRecords(): Promise<FeeRecord[]> {
  try {
    const now = new Date();
    const currentMonthKey = format(now, "yyyy-MM");
    const currentMonthLabel = format(now, "MMMM yyyy");

    // 1. Fetch payments and members concurrently in parallel
    const [payments, allMembers] = await Promise.all([
      prisma.payment.findMany({
        include: {
          member: {
            include: {
              memberships: {
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
          },
        },
        orderBy: { paymentDate: "desc" },
      }),
      prisma.member.findMany({
        include: {
          memberships: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          payments: {
            where: { month: currentMonthKey, status: "PAID" },
          },
        },
      }),
    ]);

    const feeRecords: FeeRecord[] = [];

    for (const p of payments) {
      let methodLabel: PaymentMethodType = "Cash";
      if (p.paymentMethod === "BANK_TRANSFER") methodLabel = "Bank Transfer";
      if (p.paymentMethod === "OTHER") methodLabel = "Other";

      let statusLabel: FeeStatusType = "Paid";
      if (p.status === "PENDING") statusLabel = "Due";
      if (p.status === "FAILED") statusLabel = "Overdue";

      // Parse month e.g. "2026-10" to "October 2026"
      let formattedMonth = p.month;
      try {
        const [year, month] = p.month.split("-");
        if (year && month) {
          const d = new Date(Number(year), Number(month) - 1, 1);
          formattedMonth = format(d, "MMMM yyyy");
        }
      } catch {
        formattedMonth = p.month;
      }

      feeRecords.push({
        id: p.id,
        memberId: p.member.id,
        memberName: p.member.name,
        memberCode: p.member.memberCode,
        initials: getInitials(p.member.name),
        tier: p.member.memberships[0]
          ? `Standard Plan`
          : "General",
        amount: Number(p.amount),
        month: formattedMonth,
        paymentDate: format(new Date(p.paymentDate), "dd MMM yyyy"),
        method: methodLabel,
        status: statusLabel,
      });
    }

    // 2. Add pending dues for registered members who have not paid for the current month

    for (const m of allMembers) {
      if (m.payments.length === 0 && m.memberships[0]) {
        const latest = m.memberships[0];
        const isExpired =
          latest.status !== "ACTIVE" || isBefore(new Date(latest.expiryDate), now);

        feeRecords.push({
          id: `due-${m.id}-${currentMonthKey}`,
          memberId: m.id,
          memberName: m.name,
          memberCode: m.memberCode,
          initials: getInitials(m.name),
          tier: "Standard Plan",
          amount: Number(latest.monthlyFee),
          month: currentMonthLabel,
          paymentDate: null,
          method: null,
          status: isExpired ? "Overdue" : "Due",
        });
      }
    }

    return feeRecords;
  } catch (error) {
    console.error("Failed to fetch fee records:", error);
    return [];
  }
}

export interface RecordPaymentInput {
  memberId: string;
  amount: number;
  month: string; // e.g. "October 2026" or "2026-10"
  paymentDate: string; // ISO date YYYY-MM-DD
  paymentMethod: "Cash" | "Bank Transfer" | "Other";
}

/**
 * Record a real payment in Neon PostgreSQL.
 */
export async function recordPayment(input: RecordPaymentInput) {
  // Convert month label like "October 2026" to "2026-10" if necessary
  let monthKey = input.month;
  if (!monthKey.match(/^\d{4}-\d{2}$/)) {
    try {
      const d = new Date(input.month);
      if (!isNaN(d.getTime())) {
        monthKey = format(d, "yyyy-MM");
      } else {
        monthKey = format(new Date(), "yyyy-MM");
      }
    } catch {
      monthKey = format(new Date(), "yyyy-MM");
    }
  }

  let dbMethod: "CASH" | "BANK_TRANSFER" | "OTHER" = "CASH";
  if (input.paymentMethod === "Bank Transfer") dbMethod = "BANK_TRANSFER";
  if (input.paymentMethod === "Other") dbMethod = "OTHER";

  const payment = await prisma.payment.create({
    data: {
      memberId: input.memberId,
      amount: input.amount,
      month: monthKey,
      paymentDate: new Date(input.paymentDate),
      paymentMethod: dbMethod,
      status: "PAID",
    },
    include: {
      member: true,
    },
  });

  return payment;
}
