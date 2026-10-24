import * as React from "react";
import { getMemberDashboardData } from "@/server/services/member-dashboard.service";
import { prisma } from "@/lib/db";
import type { Progress } from "@prisma/client";
import { format } from "date-fns";
import { ProgressView } from "@/components/member/progress-view";

export const metadata = {
  title: "Body Metrics & Progress | FitFlow",
  description: "Track your body weight, measurements, and fitness progress over time.",
};

export default async function MemberProgressPage() {
  const data = await getMemberDashboardData();

  if (!data) {
    return (
      <div className="py-12 text-center text-sm text-[#718078]">
        No member profile found.
      </div>
    );
  }

  const rawRecords = await prisma.progress.findMany({
    where: { memberId: data.member.id },
    orderBy: { date: "desc" },
  });

  const formattedRecords = rawRecords.map((r: Progress) => ({
    id: r.id,
    date: format(new Date(r.date), "dd MMM yyyy"),
    weight: r.weight,
    chest: r.chest,
    waist: r.waist,
    arms: r.arms,
  }));

  return (
    <ProgressView
      memberId={data.member.id}
      memberName={data.member.name}
      initialRecords={formattedRecords}
    />
  );
}
