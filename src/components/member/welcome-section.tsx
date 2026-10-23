"use client";

import * as React from "react";
import type { MemberInfo, MembershipDetails } from "@/types/member-dashboard";

interface WelcomeSectionProps {
  member: MemberInfo;
  membership: MembershipDetails;
}

export function WelcomeSection({ member, membership }: WelcomeSectionProps) {
  // Determine dynamic greeting based on current local hour
  const { greeting, subGreeting } = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return {
        greeting: "Good morning",
        subGreeting: "Ready for your morning workout session?",
      };
    } else if (hour < 17) {
      return {
        greeting: "Good afternoon",
        subGreeting: "Ready for your afternoon energy boost?",
      };
    } else {
      return {
        greeting: "Good evening",
        subGreeting: "Ready for tonight's workout session?",
      };
    }
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
      {/* Left: Dynamic Greeting */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {greeting}, {member.firstName} 👋
        </h1>
        <p className="text-sm text-[#718078] font-medium">
          {subGreeting}
        </p>
      </div>

      {/* Right: Membership Status Pill Badge */}
      <div className="flex items-center self-start sm:self-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-xs text-xs font-semibold">
          {/* Status Indicator Dot */}
          <span className="relative flex h-2 w-2">
            {membership.status === "ACTIVE" && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                membership.status === "ACTIVE" ? "bg-primary" : "bg-danger"
              }`}
            />
          </span>

          {/* Status Label */}
          <span className="text-[#14211D]">
            {membership.status === "ACTIVE" ? "Active Member" : "Membership Expired"}
          </span>

          {/* Vertical Separator */}
          <span className="h-3 w-px bg-border/80" />

          {/* Validity String */}
          <span className="text-[#718078] font-normal">
            {membership.validTillFormatted}
          </span>
        </div>
      </div>
    </div>
  );
}
