import type { DashboardData } from "@/types/dashboard";

/**
 * Service to fetch admin dashboard statistics and activity feeds.
 * Structured to allow seamless swap with live Prisma queries when database is seeded.
 */
export async function getAdminDashboardData(): Promise<DashboardData> {
  // Demo dataset structured exactly as required for production SaaS gym overview
  return {
    metrics: {
      attendance: {
        title: "TODAY'S ATTENDANCE",
        value: 87,
        trendText: "+12% vs yesterday",
        trendPositive: true,
        extraInfo: "Peak: 6:00 - 8:30 PM",
        iconName: "attendance",
        badgeVariant: "success",
      },
      totalMembers: {
        title: "TOTAL MEMBERS",
        value: 326,
        trendText: "+8 this week",
        trendPositive: true,
        extraInfo: "Roster Capacity: 72%",
        iconName: "members",
        badgeVariant: "muted",
      },
      activeMembers: {
        title: "ACTIVE MEMBERS",
        value: 310,
        trendText: "95% active rate",
        trendPositive: true,
        extraInfo: "16 paused",
        iconName: "active",
        badgeVariant: "success",
      },
      feesDue: {
        title: "FEES DUE",
        value: "Rs. 84,500",
        trendText: "14 pending",
        trendPositive: false,
        extraInfo: "Next batch due in 48h",
        iconName: "fees",
        badgeVariant: "danger",
      },
    },
    floorDensity: {
      currentAthletes: 42,
      zones: "Main Weight Floor & Cardio Wing",
      percentage: 58,
      status: "OPTIMAL ZONE",
    },
    recentCheckIns: [
      {
        id: "chk-1",
        name: "Ahmed Khan",
        initials: "AK",
        memberCode: "GYM-48291",
        tier: "Annual Pro",
        method: "QR CODE",
        time: "7:32 PM",
      },
      {
        id: "chk-2",
        name: "Ali Raza",
        initials: "AR",
        memberCode: "GYM-49221",
        tier: "Strength Tier",
        method: "MANUAL",
        time: "7:35 PM",
      },
      {
        id: "chk-3",
        name: "Hamza",
        initials: "HZ",
        memberCode: "GYM-51231",
        tier: "Monthly Pass",
        method: "QR CODE",
        time: "7:41 PM",
      },
      {
        id: "chk-4",
        name: "Bilal Tariq",
        initials: "BT",
        memberCode: "GYM-50112",
        tier: "Quarterly Active",
        method: "QR CODE",
        time: "7:46 PM",
      },
      {
        id: "chk-5",
        name: "Usman Saeed",
        initials: "US",
        memberCode: "GYM-47890",
        tier: "Personal Training",
        method: "MANUAL",
        time: "7:50 PM",
      },
    ],
    expiringMemberships: [
      {
        id: "exp-1",
        name: "Ahmed Khan",
        initials: "AK",
        plan: "Standard Monthly",
        daysRemaining: 3,
        expiryDate: "27 Nov 2024",
        urgency: "urgent",
      },
      {
        id: "exp-2",
        name: "Ali",
        initials: "AL",
        plan: "Student Athlete",
        daysRemaining: 5,
        expiryDate: "29 Nov 2024",
        urgency: "warning",
      },
      {
        id: "exp-3",
        name: "Zeeshan Malik",
        initials: "ZM",
        plan: "Couples Tier",
        daysRemaining: 6,
        expiryDate: "30 Nov 2024",
        urgency: "warning",
      },
    ],
  };
}
