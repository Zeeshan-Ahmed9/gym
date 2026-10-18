import * as React from "react";
import { Users, ShieldCheck, CalendarClock, AlertCircle, TrendingUp } from "lucide-react";
import type { MemberStats } from "@/types/member";

interface MembersStatsStripProps {
  stats: MemberStats;
}

export function MembersStatsStrip({ stats }: MembersStatsStripProps) {
  const cards = [
    {
      label: "Total Members",
      value: stats.totalStrength,
      subText: "12% growth",
      trendIcon: <TrendingUp className="h-3 w-3 text-primary inline mr-1" />,
      subTextColor: "text-primary",
      icon: <Users className="h-4 w-4 text-primary" />,
      iconBg: "bg-pale-mint border-primary/20",
    },
    {
      label: "Active Members",
      value: stats.activePassports,
      subText: "95.1% active rate",
      subTextColor: "text-muted-foreground",
      icon: <ShieldCheck className="h-4 w-4 text-success" />,
      iconBg: "bg-[#E5F6EF] border-success/20",
    },
    {
      label: "Expiring / Expired",
      value: stats.expiringOrExpired,
      subText: "Requires outreach",
      subTextColor: "text-danger",
      icon: <CalendarClock className="h-4 w-4 text-danger" />,
      iconBg: "bg-[#FDF2F2] border-danger/20",
    },
    {
      label: "Dues Outstanding",
      value: stats.duesOutstanding,
      subText: "Requires collection",
      subTextColor: "text-warning",
      icon: <AlertCircle className="h-4 w-4 text-warning" />,
      iconBg: "bg-[#FEF7EC] border-warning/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-card p-4 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {card.label}
            </span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl border ${card.iconBg}`}
            >
              {card.icon}
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {card.value}
            </span>
            <span className={`text-xs font-medium ${card.subTextColor}`}>
              {card.trendIcon}
              {card.subText}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
