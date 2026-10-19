import * as React from "react";
import { getMembersList, getMembersStats } from "@/server/services/member.service";
import { getGymSettings } from "@/server/services/settings.service";
import { MembersStatsStrip, MembersView } from "@/components/admin/members";

export const metadata = {
  title: "Members",
  description: "Manage your gym members and membership status.",
};

export default async function AdminMembersPage() {
  const [members, stats, settings] = await Promise.all([
    getMembersList(),
    getMembersStats(),
    getGymSettings(),
  ]);

  return (
    <div className="space-y-6">
      {/* 1. Top Summary Stats Cards */}
      <MembersStatsStrip stats={stats} />

      {/* 2. Search, Filter Toolbar, Members Table & Add/Edit/Delete Modals */}
      <React.Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading members...</div>}>
        <MembersView
          initialMembers={members}
          defaultMonthlyFee={settings.defaultMonthlyFee}
          defaultDurationMonths={settings.defaultMembershipDurationMonths}
        />
      </React.Suspense>
    </div>
  );
}
