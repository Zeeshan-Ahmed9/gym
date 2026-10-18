import Link from "next/link";
import { Plus } from "lucide-react";
import { getMembersList, getMembersStats } from "@/server/services/member.service";
import { MembersStatsStrip, MembersView } from "@/components/admin/members";

export const metadata = {
  title: "Members",
  description: "Manage your gym members and membership status.",
};

export default async function AdminMembersPage() {
  const [members, stats] = await Promise.all([
    getMembersList(),
    getMembersStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Members
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your gym members and membership status.
          </p>
        </div>

        {/* Right Side: + Add Member Button */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/members/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 shadow-xs select-none cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Member</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Summary Stats Cards */}
      <MembersStatsStrip stats={stats} />

      {/* 3. Search, Filter Toolbar, Members Table & Mobile Card View */}
      <MembersView initialMembers={members} />
    </div>
  );
}
