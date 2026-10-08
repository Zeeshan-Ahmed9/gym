import * as React from "react";
import Link from "next/link";
import { QrCode, SlidersHorizontal, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckInItem } from "@/types/dashboard";

interface RecentCheckinsCardProps {
  checkIns: CheckInItem[];
  className?: string;
}

export function RecentCheckinsCard({
  checkIns,
  className,
}: RecentCheckinsCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-2xl border border-border bg-[#15191D] p-5 sm:p-6 shadow-sm",
        className
      )}
    >
      <div>
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <h3 className="text-base font-extrabold text-foreground tracking-tight">
              Today&apos;s Check-ins
            </h3>
            <span className="rounded-full bg-primary/20 border border-primary/30 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary">
              LIVE FEED
            </span>
          </div>

          <Link
            href="/admin/attendance"
            className="group flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
          >
            <span>View All Attendance</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Check-ins Rows */}
        <div className="divide-y divide-border/30">
          {checkIns.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3.5 transition-colors hover:bg-card/40 rounded-xl px-2 -mx-2"
            >
              {/* Member Details with Initials */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary border border-border text-xs font-extrabold text-foreground shadow-inner">
                  {item.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="font-medium">{item.memberCode}</span>
                    <span>•</span>
                    <span className="text-[11px]">{item.tier}</span>
                  </div>
                </div>
              </div>

              {/* Method and Time */}
              <div className="flex items-center gap-3 sm:gap-6">
                {/* Method Badge */}
                {item.method === "QR CODE" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                    <QrCode className="h-3.5 w-3.5" />
                    <span>QR CODE</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/70 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>MANUAL</span>
                  </span>
                )}

                {/* Time */}
                <span className="text-xs font-semibold text-foreground/80 min-w-[58px] text-right">
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
