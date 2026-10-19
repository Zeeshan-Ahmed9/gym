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
        "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs",
        className
      )}
    >
      <div>
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Today&apos;s Check-ins
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pale-mint border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Live Feed
            </span>
          </div>

          <Link
            href="/admin/attendance"
            className="group flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <span>View All Attendance</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Check-ins Rows */}
        {checkIns.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground mb-3">
              <QrCode className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">No check-ins recorded today</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Member check-in records will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {checkIns.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3.5 transition-colors hover:bg-[#F5F8F6]/60 rounded-xl px-2 -mx-2"
              >
                {/* Member Details with Initials */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pale-mint border border-primary/20 text-xs font-bold text-primary">
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-mono text-xs">{item.memberCode}</span>
                      <span>•</span>
                      <span>{item.tier}</span>
                    </div>
                  </div>
                </div>

                {/* Method and Time */}
                <div className="flex items-center gap-3 sm:gap-6">
                  {/* Method Badge */}
                  {item.method === "QR CODE" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-pale-mint px-2.5 py-1 text-xs font-semibold text-primary">
                      <QrCode className="h-3.5 w-3.5" />
                      <span>QR Code</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Manual</span>
                    </span>
                  )}

                  {/* Time */}
                  <span className="text-xs font-medium text-muted-foreground min-w-[58px] text-right">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
