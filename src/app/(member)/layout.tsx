import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MemberNavbar, MemberFooter } from "@/components/member";
import { getMemberDashboardData } from "@/server/services/member-dashboard.service";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Defense-in-depth: require auth in production
  if (process.env.NODE_ENV === "production" && !session?.user) {
    redirect("/login");
  }

  const dashboardData = await getMemberDashboardData();

  // Fallback defaults if database is momentarily empty
  const member = dashboardData?.member ?? {
    id: "guest",
    name: "Ahmed Khan",
    firstName: "Ahmed",
    initials: "AK",
    memberCode: "GYM-48291",
    phone: "",
    email: "",
  };

  const membership = dashboardData?.membership ?? {
    status: "ACTIVE" as const,
    planName: "Standard Plan",
    monthlyFee: 3000,
    billingPeriod: "/mo",
    expiryDate: "28 Oct 2026",
    validTillFormatted: "Valid till 28 Oct 2026",
    isExpired: false,
    renewsFormatted: "Renews 24 Nov",
    feeStatus: "PAID" as const,
    duesAmount: 0,
  };

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
