import { getAdminDashboardData } from "@/server/services/dashboard.service";
import {
  SummaryCard,
  RecentCheckinsCard,
  ExpiringMembershipsCard,
  QuickCheckInButton,
  AttendanceQrKioskButton,
} from "@/components/admin";

export const metadata = {
  title: "Dashboard",
  description: "Gym Overview and Operations Center",
};

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      {/* Top Section: Overview Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back. Here is today&apos;s overview across your gym.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <AttendanceQrKioskButton />
          <QuickCheckInButton />
        </div>
      </div>

      {/* Summary Cards Grid: Total Members, Active Members, Today's Attendance, Fees Due */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard metric={data.metrics.totalMembers} />
        <SummaryCard metric={data.metrics.activeMembers} />
        <SummaryCard metric={data.metrics.attendance} />
        <SummaryCard metric={data.metrics.feesDue} />
      </div>

      {/* Lower Section: Today's Check-ins & Memberships Expiring Soon */}
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
