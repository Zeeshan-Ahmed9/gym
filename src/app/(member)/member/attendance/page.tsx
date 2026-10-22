import * as React from "react";
import { getMemberAttendanceData } from "@/server/services/member-attendance.service";
import { MemberAttendanceView } from "@/components/member/attendance";
import { Calendar, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "My Attendance | FitFlow",
  description: "Track your personal gym attendance history, turnstile entries, and workout consistency.",
};

export default async function MemberAttendancePage() {
  const data = await getMemberAttendanceData();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-12 text-center shadow-xs my-8 space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
          <Users className="h-7 w-7" />
        </div>
        <div className="max-w-md space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-[#14211D]">
            No Member Profile Found
          </h2>
          <p className="text-sm text-[#718078]">
            Please register or add a member in the Admin section to view personal attendance stats.
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

  return <MemberAttendanceView initialData={data} />;
}
