import * as React from "react";
import { getMemberDashboardData } from "@/server/services/member-dashboard.service";
import { getGymSettings } from "@/server/services/settings.service";
import { MemberProfileView } from "@/components/member/profile";

export const metadata = {
  title: "My Profile | FitFlow",
  description: "View your personal profile details, digital membership pass, and club privileges.",
};

export default async function MemberProfilePage() {
  const [data, settings] = await Promise.all([
    getMemberDashboardData(),
    getGymSettings(),
  ]);

  if (!data) {
    return (
      <div className="py-16 text-center text-sm font-medium text-[#718078]">
        No member profile found.
      </div>
    );
  }

  return (
    <MemberProfileView
      initialData={data}
      gymSettings={{
        gymName: settings.gymName,
        phone: settings.phone,
        address: settings.address,
      }}
    />
  );
}

