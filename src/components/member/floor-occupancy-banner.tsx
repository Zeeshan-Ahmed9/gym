"use client";

import * as React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import type { FloorOccupancyData } from "@/types/member-dashboard";

interface FloorOccupancyBannerProps {
  occupancy: FloorOccupancyData;
}

export function FloorOccupancyBanner({ occupancy }: FloorOccupancyBannerProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Occupancy icon & text */}
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary shadow-xs">
          <Activity className="h-5 w-5 stroke-[2.2]" />
        </div>

        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-foreground">
            Floor Occupancy & Live Hours
          </h3>
          <p className="text-xs text-[#718078] leading-relaxed">
            {occupancy.statusText}
          </p>
        </div>
      </div>

      {/* Right: Quick Navigation Actions */}
      <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0 w-full sm:w-auto">
        <Link
          href="/member/attendance"
          className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-[#F5F8F6] transition-colors shadow-xs"
        >
          View History
        </Link>
        <Link
          href="/member/progress"
          className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-primary hover:bg-[#d5ede3] transition-colors shadow-xs"
        >
          Body Progress
        </Link>
      </div>
    </div>
  );
}
