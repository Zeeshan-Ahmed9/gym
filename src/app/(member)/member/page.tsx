import * as React from "react";
import { getMemberDashboardData } from "@/server/services/member-dashboard.service";
import {
  WelcomeSection,
  QrCheckInCard,
  MemberStatsCards,
  FloorOccupancyBanner,
} from "@/components/member";
import { Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Member Dashboard | FitFlow",
  description: "Personal gym member portal, attendance QR scanner, body metrics, and membership details.",
};

export default async function MemberHomePage() {
  const dashboardData = await getMemberDashboardData();

  if (!dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-12 text-center shadow-xs my-8 space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
          <Users className="h-7 w-7" />
        </div>
        <div className="max-w-md space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-[#14211D]">
            No Member Record Found
          </h2>
          <p className="text-sm text-[#718078]">
            Please register or add a member in the Admin section to view personal stats and turnstile entry.
          </p>
        </div>
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-hover transition-all shadow-xs"
        >
          <span>Go to Admin Members</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* 1. Welcome Greeting & Membership Status Badge */}
      <WelcomeSection
        member={dashboardData.member}
        membership={dashboardData.membership}
      />

      {/* 2. Main Feature Card — QR Gym Check-in */}
      <QrCheckInCard
        attendance={dashboardData.attendance}
        memberId={dashboardData.member.id}
      />

      {/* 3. Four Statistics Cards (Visits, Streak, Membership, Body Metrics) */}
      <MemberStatsCards
        attendance={dashboardData.attendance}
        membership={dashboardData.membership}
        bodyMetrics={dashboardData.bodyMetrics}
        memberId={dashboardData.member.id}
      />

      {/* 4. Floor Occupancy and Live Hours Banner */}
      <FloorOccupancyBanner occupancy={dashboardData.occupancy} />
    </div>
  );
}
