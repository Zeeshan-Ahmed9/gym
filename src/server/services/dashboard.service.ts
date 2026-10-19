import { prisma } from "@/lib/db";
import type { DashboardData, CheckInItem, ExpiringMembershipItem } from "@/types/dashboard";
import { format, startOfDay, endOfDay, addDays, isBefore, differenceInDays } from "date-fns";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "M";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Fetch live admin dashboard statistics and real activity feeds from Neon PostgreSQL.
 */
export async function getAdminDashboardData(): Promise<DashboardData> {
  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const currentMonthKey = format(now, "yyyy-MM");
    const sevenDaysFromNow = addDays(now, 7);

    // 1. Today's Attendance count
    const todayAttendanceCount = await prisma.attendance.count({
      where: {
        checkInTime: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    // 2. Members with latest memberships and payments
    const allMembers = await prisma.member.findMany({
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
    });

    const totalMembers = allMembers.length;
    let activeMembers = 0;
    let pendingDuesTotal = 0;
    let pendingCount = 0;

    const expiringMemberships: ExpiringMembershipItem[] = [];

    for (const member of allMembers) {
      const latest = member.memberships[0];
      if (!latest) continue;

      const expiry = new Date(latest.expiryDate);
      const isExpired = latest.status !== "ACTIVE" || isBefore(expiry, now);

      if (!isExpired) {
        activeMembers++;

        // Check if expiring within 7 days
        if (isBefore(expiry, sevenDaysFromNow)) {
          const daysRemaining = Math.max(0, differenceInDays(expiry, now));
          expiringMemberships.push({
            id: `exp-${member.id}`,
            name: member.name,
            initials: getInitials(member.name),
            plan: `Monthly (Rs. ${Number(latest.monthlyFee).toLocaleString()})`,
            daysRemaining,
            expiryDate: format(expiry, "dd MMM yyyy"),
            urgency: daysRemaining <= 3 ? "urgent" : "warning",
          });
        }
      }

      // Check fee dues for current month
      const hasPaid = member.payments.length > 0;
      if (!hasPaid) {
        pendingDuesTotal += Number(latest.monthlyFee);
        pendingCount++;
      }
    }

    const activeRate =
      totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0;

    // 3. Recent check-ins from database
    const recentAttendances = await prisma.attendance.findMany({
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
      take: 6,
    });

    const recentCheckIns: CheckInItem[] = recentAttendances.map((att) => {
      const latestPlan = att.member.memberships[0];
      return {
        id: att.id,
        name: att.member.name,
        initials: getInitials(att.member.name),
        memberCode: att.member.memberCode,
        tier: latestPlan ? `Monthly Plan` : "General",
        method: att.method === "QR" ? "QR CODE" : "MANUAL",
        time: format(new Date(att.checkInTime), "h:mm a"),
      };
    });

    return {
      metrics: {
        attendance: {
          title: "TODAY'S ATTENDANCE",
          value: todayAttendanceCount,
          trendText: todayAttendanceCount > 0 ? `${todayAttendanceCount} checked in today` : "No check-ins yet",
          trendPositive: todayAttendanceCount > 0,
          extraInfo: "Daily verification log",
          iconName: "attendance",
          badgeVariant: "success",
        },
        totalMembers: {
          title: "TOTAL MEMBERS",
          value: totalMembers,
          trendText: totalMembers > 0 ? `${totalMembers} registered` : "No members yet",
          trendPositive: true,
          extraInfo: "Live roster count",
          iconName: "members",
          badgeVariant: "muted",
        },
        activeMembers: {
          title: "ACTIVE MEMBERS",
          value: activeMembers,
          trendText: `${activeRate}% active rate`,
          trendPositive: activeMembers > 0,
          extraInfo: `${totalMembers - activeMembers} expired/inactive`,
          iconName: "active",
          badgeVariant: "success",
        },
        feesDue: {
          title: "FEES DUE",
          value: `Rs. ${pendingDuesTotal.toLocaleString()}`,
          trendText: `${pendingCount} pending this month`,
          trendPositive: pendingCount === 0,
          extraInfo: "Outstanding dues",
          iconName: "fees",
          badgeVariant: pendingCount > 0 ? "danger" : "success",
        },
      },
      floorDensity: {
        currentAthletes: todayAttendanceCount,
        zones: "Main Weight Floor & Cardio Wing",
        percentage: Math.min(100, Math.round((todayAttendanceCount / 50) * 100)),
        status: todayAttendanceCount > 0 ? "OPTIMAL ZONE" : "FLOOR CLEAR",
      },
      recentCheckIns,
      expiringMemberships,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return {
      metrics: {
        attendance: {
          title: "TODAY'S ATTENDANCE",
          value: 0,
          trendText: "0 vs yesterday",
          trendPositive: true,
          extraInfo: "Peak: —",
          iconName: "attendance",
          badgeVariant: "success",
        },
        totalMembers: {
          title: "TOTAL MEMBERS",
          value: 0,
          trendText: "No members",
          trendPositive: true,
          extraInfo: "Roster: 0%",
          iconName: "members",
          badgeVariant: "muted",
        },
        activeMembers: {
          title: "ACTIVE MEMBERS",
          value: 0,
          trendText: "0% active rate",
          trendPositive: true,
          extraInfo: "0 paused",
          iconName: "active",
          badgeVariant: "success",
        },
        feesDue: {
          title: "FEES DUE",
          value: "Rs. 0",
          trendText: "0 pending",
          trendPositive: true,
          extraInfo: "No dues",
          iconName: "fees",
          badgeVariant: "success",
        },
      },
      floorDensity: {
        currentAthletes: 0,
        zones: "Main Weight Floor & Cardio Wing",
        percentage: 0,
        status: "FLOOR CLEAR",
      },
      recentCheckIns: [],
      expiringMemberships: [],
    };
  }
}
