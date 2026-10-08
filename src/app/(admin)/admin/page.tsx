import { SlidersHorizontal } from "lucide-react";
import { getAdminDashboardData } from "@/server/services/dashboard.service";
import {
  SummaryCard,
  FloorDensityCard,
  RecentCheckinsCard,
  ExpiringMembershipsCard,
  QuickCheckInButton,
} from "@/components/admin";

export const metadata = {
  title: "Admin Dashboard",
  description: "Live Gym Overview and Operations Center",
};

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      {/* Top Section: Overview Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Title & Subtitles */}
        <div>
          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="rounded-md bg-primary/20 border border-primary/30 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary">
              HQ OVERVIEW
            </span>
            <span className="text-muted-foreground/60">•</span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span>Live Floor Sync</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            Gym Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Welcome back, Admin. Here&apos;s today&apos;s snapshot across active zones.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Check-in Button */}
          <QuickCheckInButton />

          {/* Filter / Settings action button */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-[#15191D] text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 active:scale-[0.98] transition-all select-none cursor-pointer"
            aria-label="Filter Overview"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard metric={data.metrics.attendance} />
        <SummaryCard metric={data.metrics.totalMembers} />
        <SummaryCard metric={data.metrics.activeMembers} />
        <SummaryCard metric={data.metrics.feesDue} />
      </div>

      {/* Floor Density Banner */}
      <FloorDensityCard data={data.floorDensity} />

      {/* Lower Section: Today's Check-ins & Memberships Expiring */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Today's Check-ins Feed */}
        <div className="lg:col-span-7 xl:col-span-8">
          <RecentCheckinsCard checkIns={data.recentCheckIns} />
        </div>

        {/* Right Column: Memberships Expiring */}
        <div className="lg:col-span-5 xl:col-span-4">
          <ExpiringMembershipsCard expiringMembers={data.expiringMemberships} />
        </div>
      </div>
    </div>
  );
}
