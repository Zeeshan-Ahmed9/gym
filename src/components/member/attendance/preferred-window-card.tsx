"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import type { TimeDistributionBucket } from "@/types/member-attendance";

interface PreferredWindowCardProps {
  peakTimeLabel: string;
  hasData: boolean;
  distribution: TimeDistributionBucket[];
}

export function PreferredWindowCard({
  peakTimeLabel,
  hasData,
  distribution,
}: PreferredWindowCardProps) {
  // Mini chart bar heights (7 bars representing timeline from morning to night)
  const defaultBars = [
    { height: 18, isPeak: false, color: "bg-[#E3EAE5]" },
    { height: 26, isPeak: false, color: "bg-[#E3EAE5]" },
    { height: 22, isPeak: false, color: "bg-[#E3EAE5]" },
    { height: 42, isPeak: false, color: "bg-[#A7E4CD]" },
    { height: 85, isPeak: true, color: "bg-primary" }, // Peak bar in strong emerald
    { height: 46, isPeak: false, color: "bg-[#A7E4CD]" },
    { height: 20, isPeak: false, color: "bg-[#E3EAE5]" },
  ];

  const bars = React.useMemo(() => {
    if (distribution && distribution.length > 0) {
      const maxCount = Math.max(...distribution.map((d) => d.count), 1);
      return distribution.map((d) => {
        const height = Math.max(16, Math.round((d.count / maxCount) * 85));
        return {
          height,
          isPeak: d.isPeak,
          color: d.isPeak ? "bg-primary" : height > 40 ? "bg-[#A7E4CD]" : "bg-[#E3EAE5]",
        };
      });
    }
    return defaultBars;
  }, [distribution]);

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#BAC8BF] transition-all">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
          PREFERRED CHECK-IN WINDOW
        </span>
        <Clock className="h-4 w-4 text-[#718078]" />
      </div>

      {/* Supporting Text */}
      {hasData ? (
        <p className="text-xs text-[#718078] font-medium leading-relaxed">
          Peak attendance typically falls between{" "}
          <strong className="text-foreground font-semibold">{peakTimeLabel}</strong>.
        </p>
      ) : (
        <p className="text-xs text-[#718078] font-medium">
          Your preferred check-in time will appear after you&apos;ve built some attendance history.
        </p>
      )}

      {/* Mini Bar Chart Area */}
      <div className="rounded-2xl bg-[#F9FBFA] border border-border/60 p-4 pt-6">
        {/* Bars Container */}
        <div className="flex items-end justify-between gap-2 h-16 px-2">
          {bars.map((bar, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full"
            >
              <div
                className={`w-full max-w-[36px] rounded-t-lg transition-all duration-500 ${bar.color} ${
                  bar.isPeak ? "shadow-xs" : ""
                }`}
                style={{ height: `${bar.height}%` }}
                title={bar.isPeak ? `Peak: ${peakTimeLabel}` : undefined}
              />
            </div>
          ))}
        </div>

        {/* Labels below chart */}
        <div className="flex items-center justify-between text-[11px] text-[#718078] font-medium pt-3 px-1 border-t border-border/40 mt-1">
          <span>Morning</span>
          <span className="font-semibold text-foreground">Evening Peak</span>
          <span>Night</span>
        </div>
      </div>
    </div>
  );
}
