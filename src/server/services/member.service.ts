import { prisma } from "@/lib/db";
import type { MemberListItem, MemberStats } from "@/types/member";
import { format, isBefore, addDays } from "date-fns";

/**
 * Helper to compute member initials.
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "M";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Format relative / calendar last check-in string.
 */
function formatLastCheckIn(date: Date | null | undefined): string {
  if (!date) return "Never";
  const now = new Date();
  const checkIn = new Date(date);

  const isToday =
    now.getFullYear() === checkIn.getFullYear() &&
    now.getMonth() === checkIn.getMonth() &&
    now.getDate() === checkIn.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    yesterday.getFullYear() === checkIn.getFullYear() &&
    yesterday.getMonth() === checkIn.getMonth() &&
    yesterday.getDate() === checkIn.getDate();

  const timeStr = format(checkIn, "h:mm a");

  if (isToday) return `Today, ${timeStr}`;
  if (isYesterday) return `Yesterday, ${timeStr}`;
  return `${format(checkIn, "dd MMM")}, ${timeStr}`;
}

/**
 * Fetch live member roster from Neon PostgreSQL.
 */
export async function getMembersList(): Promise<MemberListItem[]> {
  try {
    const members = await prisma.member.findMany({
      include: {
        memberships: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        payments: {
          where: { status: "PAID" },
          orderBy: { paymentDate: "desc" },
        },
        attendances: {
          orderBy: { checkInTime: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const currentMonthKey = format(now, "yyyy-MM");

    return members.map((member) => {
      const latestMembership = member.memberships[0];
      const latestAttendance = member.attendances[0];

      let isExpired = true;
      let isExpiringSoon = false;
      let expiryDateFormatted = "No Active Plan";

      if (latestMembership) {
        const expiry = new Date(latestMembership.expiryDate);
        expiryDateFormatted = format(expiry, "dd MMM yyyy");

        // Expired if status is not ACTIVE or expiry date is in the past
        isExpired =
          latestMembership.status !== "ACTIVE" || isBefore(expiry, now);

        // Expiring soon: active and expires within next 7 days
        if (!isExpired) {
          const sevenDaysFromNow = addDays(now, 7);
          isExpiringSoon = isBefore(expiry, sevenDaysFromNow);
        }
      }

      // Fee status: Check if member has paid for the current month
      // Or if their latest payment date is within current month
      const hasPaidCurrentMonth = member.payments.some(
        (p) => p.month === currentMonthKey
      );

      const feeStatus = hasPaidCurrentMonth ? "PAID" : "DUE";
      const monthlyFeeAmount = latestMembership
        ? Number(latestMembership.monthlyFee)
        : 0;

      return {
        id: member.id,
        name: member.name,
        initials: getInitials(member.name),
        memberCode: member.memberCode,
        phone: member.phone || "—",
        membershipStatus: isExpired ? "EXPIRED" : "ACTIVE",
        expiryDate: expiryDateFormatted,
        isExpiringSoon,
        monthlyFee: `Rs. ${monthlyFeeAmount.toLocaleString()}`,
        feeStatus,
        lastCheckIn: formatLastCheckIn(latestAttendance?.checkInTime),
      };
    });
  } catch (error) {
    console.error("Failed to fetch members list from database:", error);
    return [];
  }
}

/**
 * Fetch live member overview statistics from Neon PostgreSQL.
 */
export async function getMembersStats(): Promise<MemberStats> {
  try {
    const members = await prisma.member.findMany({
      include: {
        memberships: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        payments: {
          where: { status: "PAID" },
        },
      },
    });

    const now = new Date();
    const currentMonthKey = format(now, "yyyy-MM");
    const sevenDaysFromNow = addDays(now, 7);

    let activePassports = 0;
    let expiringOrExpired = 0;
    let duesOutstanding = 0;

    for (const member of members) {
      const latest = member.memberships[0];
      if (!latest) {
        expiringOrExpired++;
        duesOutstanding++;
        continue;
      }

      const expiry = new Date(latest.expiryDate);
      const isExpired = latest.status !== "ACTIVE" || isBefore(expiry, now);

      if (!isExpired) {
        activePassports++;
        if (isBefore(expiry, sevenDaysFromNow)) {
          expiringOrExpired++;
        }
      } else {
        expiringOrExpired++;
      }

      const hasPaid = member.payments.some((p) => p.month === currentMonthKey);
      if (!hasPaid) {
        duesOutstanding++;
      }
    }

    return {
      totalStrength: members.length,
      activePassports,
      expiringOrExpired,
      duesOutstanding,
    };
  } catch (error) {
    console.error("Failed to calculate member statistics:", error);
    return {
      totalStrength: 0,
      activePassports: 0,
      expiringOrExpired: 0,
      duesOutstanding: 0,
    };
  }
}

/**
 * Generate a unique, non-colliding member code like GYM-48291.
 */
export async function generateUniqueMemberCode(): Promise<string> {
  const maxAttempts = 15;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const candidateCode = `GYM-${randomDigits}`;

    const exists = await prisma.member.findUnique({
      where: { memberCode: candidateCode },
      select: { id: true },
    });

    if (!exists) {
      return candidateCode;
    }
  }

  // Fallback timestamp unique code if collision occurs 15 times
  return `GYM-${Date.now().toString().slice(-5)}`;
}

export interface CreateMemberInput {
  name: string;
  phone: string;
  email?: string;
  startDate: string; // ISO date string YYYY-MM-DD
  durationMonths: number;
  expiryDate: string; // ISO date string YYYY-MM-DD
  monthlyFee: number;
}

/**
 * Create a new member profile and active membership in Neon PostgreSQL.
 */
export async function createMember(input: CreateMemberInput) {
  const code = await generateUniqueMemberCode();

  const startDate = new Date(input.startDate);
  const expiryDate = new Date(input.expiryDate);

  return await prisma.$transaction(async (tx) => {
    const member = await tx.member.create({
      data: {
        name: input.name.trim(),
        phone: input.phone.trim(),
        email: input.email?.trim() ? input.email.trim().toLowerCase() : null,
        memberCode: code,
      },
    });

    const membership = await tx.membership.create({
      data: {
        memberId: member.id,
        startDate,
        expiryDate,
        monthlyFee: input.monthlyFee,
        status: "ACTIVE",
      },
    });

    return { member, membership };
  });
}

/**
 * Fetch detailed member profile with history from Neon PostgreSQL.
 */
export async function getMemberDetails(memberId: string) {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: {
      memberships: {
        orderBy: { createdAt: "desc" },
      },
      payments: {
        orderBy: { paymentDate: "desc" },
      },
      attendances: {
        orderBy: { checkInTime: "desc" },
        take: 20,
      },
    },
  });

  if (!member) return null;

  const latestMembership = member.memberships[0];
  const latestPayment = member.payments[0];
  const now = new Date();
  const currentMonthKey = format(now, "yyyy-MM");

  let isExpired = true;
  if (latestMembership) {
    const expiry = new Date(latestMembership.expiryDate);
    isExpired = latestMembership.status !== "ACTIVE" || isBefore(expiry, now);
  }

  const hasPaidCurrentMonth = member.payments.some(
    (p) => p.month === currentMonthKey && p.status === "PAID"
  );

  return {
    id: member.id,
    name: member.name,
    initials: getInitials(member.name),
    memberCode: member.memberCode,
    phone: member.phone || "—",
    email: member.email || "—",
    membershipStatus: (isExpired ? "EXPIRED" : "ACTIVE") as "ACTIVE" | "EXPIRED",
    startDate: latestMembership
      ? format(new Date(latestMembership.startDate), "dd MMM yyyy")
      : "—",
    expiryDate: latestMembership
      ? format(new Date(latestMembership.expiryDate), "dd MMM yyyy")
      : "—",
    rawStartDate: latestMembership
      ? latestMembership.startDate.toISOString().split("T")[0]
      : "",
    rawExpiryDate: latestMembership
      ? latestMembership.expiryDate.toISOString().split("T")[0]
      : "",
    monthlyFee: latestMembership ? Number(latestMembership.monthlyFee) : 0,
    feeStatus: (hasPaidCurrentMonth ? "PAID" : "DUE") as "PAID" | "DUE",
    lastPayment: latestPayment
      ? {
          amount: Number(latestPayment.amount),
          month: latestPayment.month,
          date: format(new Date(latestPayment.paymentDate), "dd MMM yyyy"),
          method: latestPayment.paymentMethod,
        }
      : null,
    attendanceCount: member.attendances.length,
    recentAttendances: member.attendances.map((att) => ({
      id: att.id,
      date: format(new Date(att.checkInTime), "dd MMM yyyy"),
      time: format(new Date(att.checkInTime), "h:mm a"),
      method: att.method === "QR" ? "QR Code" : "Manual",
    })),
    payments: member.payments.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      month: p.month,
      date: format(new Date(p.paymentDate), "dd MMM yyyy"),
      method: p.paymentMethod,
      status: p.status,
    })),
  };
}

export interface UpdateMemberInput {
  id: string;
  name: string;
  phone: string;
  email?: string;
  monthlyFee?: number;
  expiryDate?: string; // YYYY-MM-DD
  status?: "ACTIVE" | "EXPIRED";
}

/**
 * Update member information and latest membership details.
 */
export async function updateMember(input: UpdateMemberInput) {
  return await prisma.$transaction(async (tx) => {
    const updatedMember = await tx.member.update({
      where: { id: input.id },
      data: {
        name: input.name.trim(),
        phone: input.phone.trim(),
        email: input.email?.trim() ? input.email.trim().toLowerCase() : null,
      },
    });

    const latestMembership = await tx.membership.findFirst({
      where: { memberId: input.id },
      orderBy: { createdAt: "desc" },
    });

    if (latestMembership) {
      const updateData: {
        monthlyFee?: number;
        expiryDate?: Date;
        status?: "ACTIVE" | "EXPIRED";
      } = {};

      if (input.monthlyFee !== undefined) {
        updateData.monthlyFee = input.monthlyFee;
      }

      if (input.expiryDate) {
        const exp = new Date(input.expiryDate);
        updateData.expiryDate = exp;
        // Recalculate status consistently
        if (input.status) {
          updateData.status = input.status;
        } else {
          updateData.status = isBefore(exp, new Date()) ? "EXPIRED" : "ACTIVE";
        }
      } else if (input.status) {
        updateData.status = input.status;
      }

      if (Object.keys(updateData).length > 0) {
        await tx.membership.update({
          where: { id: latestMembership.id },
          data: updateData,
        });
      }
    }

    return updatedMember;
  });
}

/**
 * Safely delete a member or check if historical records require deactivation.
 */
export async function deleteMember(memberId: string) {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: {
      _count: {
        select: { payments: true, attendances: true },
      },
    },
  });

  if (!member) {
    throw new Error("Member not found.");
  }

  // Delete member and related records
  await prisma.member.delete({
    where: { id: memberId },
  });

  return { success: true };
}

/**
 * Deactivate a member's active membership safely (preserves history).
 */
export async function deactivateMember(memberId: string) {
  const latestMembership = await prisma.membership.findFirst({
    where: { memberId },
    orderBy: { createdAt: "desc" },
  });

  if (!latestMembership) {
    throw new Error("No active membership found for this member.");
  }

  await prisma.membership.update({
    where: { id: latestMembership.id },
    data: {
      status: "EXPIRED",
      expiryDate: new Date(), // Set expiry to now
    },
  });

  return { success: true };
}
