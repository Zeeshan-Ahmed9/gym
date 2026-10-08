import * as React from "react";
import { Users, ShieldCheck, CalendarClock, AlertCircle, TrendingUp } from "lucide-react";
import type { MemberStats } from "@/types/member";

interface MembersStatsStripProps {
  stats: MemberStats;
}

export function MembersStatsStrip({ stats }: MembersStatsStripProps) {
  const cards = [
    {
      label: "TOTAL STRENGTH",
      value: stats.totalStrength,
      subText: "↑ 12% mo.",
      trendIcon: <TrendingUp className="h-3 w-3 text-primary inline mr-0.5" />,
      subTextColor: "text-primary",
      icon: <Users className="h-4 w-4 text-primary" />,
      iconBg: "bg-primary/10 border-primary/20",
    },
    {
      label: "ACTIVE PASSPORTS",
      value: stats.activePassports,
      subText: "95.1% total",
      subTextColor: "text-muted-foreground",
      icon: <ShieldCheck className="h-4 w-4 text-success" />,
      iconBg: "bg-success/10 border-success/20",
    },
    {
      label: "EXPIRING / EXPIRED",
      value: stats.expiringOrExpired,
      subText: "Requires outreach",
      subTextColor: "text-danger/90",
      icon: <CalendarClock className="h-4 w-4 text-danger" />,
      iconBg: "bg-danger/10 border-danger/20",
    },
    {
      label: "DUES OUTSTANDING",
      value: stats.duesOutstanding,
      subText: "1 overdue lock",
      subTextColor: "text-warning/90",
      icon: <AlertCircle className="h-4 w-4 text-warning" />,
      iconBg: "bg-warning/10 border-warning/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-[#15191D] p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              {card.label}
            </span>
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg border ${card.iconBg}`}
            >
              {card.icon}
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {card.value}
            </span>
            <span className={`text-xs font-semibold ${card.subTextColor}`}>
              {card.trendIcon}
              {card.subText}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
