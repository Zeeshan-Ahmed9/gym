import { prisma } from "@/lib/db";
import type { AttendanceRecord, AttendanceSummaryData, DateFilterOption } from "@/types/attendance";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subDays, isBefore } from "date-fns";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "M";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Fetch live admin attendance summary metrics from Neon PostgreSQL.
 */
export async function getAttendanceSummary(): Promise<AttendanceSummaryData> {
  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const [todayCount, monthCount, allMonthAttendances] = await Promise.all([
      prisma.attendance.count({
        where: {
          checkInTime: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
      prisma.attendance.count({
        where: {
          checkInTime: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      }),
      prisma.attendance.findMany({
        where: {
          checkInTime: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        select: { method: true },
      }),
    ]);

    let qrCount = 0;
    let manualCount = 0;

    for (const record of allMonthAttendances) {
      if (record.method === "QR") {
        qrCount++;
      } else {
        manualCount++;
      }
    }

    const total = qrCount + manualCount;
    const qrPercentage = total > 0 ? Math.round((qrCount / total) * 100) : 0;
    const manualPercentage = total > 0 ? Math.round((manualCount / total) * 100) : 0;

    return {
      todayCount,
      monthCount,
      qrPercentage,
      manualPercentage,
    };
  } catch (error) {
    console.error("Failed to fetch attendance summary:", error);
    return {
      todayCount: 0,
      monthCount: 0,
      qrPercentage: 0,
      manualPercentage: 0,
    };
  }
}

/**
 * Fetch live attendance log entries from Neon PostgreSQL.
 */
export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
  try {
    const records = await prisma.attendance.findMany({
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
      orderBy: { checkInTime: "desc" },
      take: 100,
    });

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const yesterdayStart = startOfDay(subDays(now, 1));
    const yesterdayEnd = endOfDay(subDays(now, 1));

    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    return records.map((record) => {
      const checkInTime = new Date(record.checkInTime);
      const member = record.member;
      const latestMembership = member.memberships[0];

      let dateCategory: DateFilterOption = "This Month";
      let checkInDateStr = format(checkInTime, "MMM dd");

      if (checkInTime >= todayStart && checkInTime <= todayEnd) {
        dateCategory = "Today";
        checkInDateStr = "Today";
      } else if (checkInTime >= yesterdayStart && checkInTime <= yesterdayEnd) {
        dateCategory = "Yesterday";
        checkInDateStr = "Yesterday";
      } else if (checkInTime >= weekStart && checkInTime <= weekEnd) {
        dateCategory = "This Week";
      } else if (checkInTime >= monthStart && checkInTime <= monthEnd) {
        dateCategory = "This Month";
      }

      let isExpired = true;
      if (latestMembership) {
        const expiry = new Date(latestMembership.expiryDate);
        isExpired = latestMembership.status !== "ACTIVE" || isBefore(expiry, now);
      }

      return {
        id: record.id,
        memberId: member.id,
        memberName: member.name,
        memberCode: member.memberCode,
        initials: getInitials(member.name),
        checkInTime: format(checkInTime, "h:mm a"),
        checkInDate: checkInDateStr,
        method: record.method === "QR" ? "QR Code" : "Manual",
        membershipTier: latestMembership ? `Monthly Plan (Rs. ${Number(latestMembership.monthlyFee).toLocaleString()})` : "Standard Member",
        membershipStatus: isExpired ? "Expired" : "Active",
        status: "Verified",
        dateCategory,
      };
    });
  } catch (error) {
    console.error("Failed to fetch attendance records:", error);
    return [];
  }
}

/**
 * Record manual check-in for a member by code with duplicate prevention.
 */
export async function recordManualCheckIn(memberCode: string) {
  const code = memberCode.trim().toUpperCase();

  const member = await prisma.member.findUnique({
    where: { memberCode: code },
    include: {
      memberships: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!member) {
    throw new Error(`Member with code "${code}" not found.`);
  }

  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  // Prevent duplicate check-in today
  const existingToday = await prisma.attendance.findFirst({
    where: {
      memberId: member.id,
      checkInTime: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  if (existingToday) {
    const timeStr = format(new Date(existingToday.checkInTime), "h:mm a");
    throw new Error(`${member.name} has already checked in today at ${timeStr}.`);
  }

  const latestMembership = member.memberships[0];
  let isExpired = true;
  let expiryDateStr = "No Active Plan";
  if (latestMembership) {
    const expiry = new Date(latestMembership.expiryDate);
    isExpired = latestMembership.status !== "ACTIVE" || isBefore(expiry, now);
    expiryDateStr = format(expiry, "dd MMM yyyy");
  }

  const attendance = await prisma.attendance.create({
    data: {
      memberId: member.id,
      checkInTime: now,
      method: "MEMBER_CODE",
    },
  });

  return {
    id: attendance.id,
    name: member.name,
    code: member.memberCode,
    membershipStatus: isExpired ? "Expired" : "Active",
    expiryDate: expiryDateStr,
    checkInTime: `Today • ${format(now, "h:mm a")}`,
  };
}
