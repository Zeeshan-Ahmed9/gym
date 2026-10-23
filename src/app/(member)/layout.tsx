import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MemberNavbar, MemberFooter } from "@/components/member";
import { getMemberDashboardData } from "@/server/services/member-dashboard.service";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionMemberId = cookieStore.get("fitflow_member_session")?.value;

  if (!sessionMemberId) {
    redirect("/member/login");
  }

  const dashboardData = await getMemberDashboardData(sessionMemberId);

  if (!dashboardData) {
    redirect("/member/login");
  }

  const member = dashboardData.member;
  const membership = dashboardData.membership;

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F8F6] font-sans text-foreground">
      <MemberNavbar member={member} membership={membership} />
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 sm:px-6 pt-6 sm:pt-8 pb-12">
        {children}
      </main>
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
        <MemberFooter />
      </div>
    </div>
  );
}
