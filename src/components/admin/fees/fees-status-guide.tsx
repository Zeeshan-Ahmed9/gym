"use client";

import * as React from "react";

export function FeesStatusGuide() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-2.5 text-xs shadow-xs">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <span className="text-xs font-semibold text-muted-foreground">
          Status Guide:
        </span>

        {/* Paid */}
        <div className="inline-flex items-center gap-1.5 text-xs">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-success font-semibold">Paid</span>
          <span className="text-muted-foreground">— Cleared for month</span>
        </div>

        {/* Due */}
        <div className="inline-flex items-center gap-1.5 text-xs">
          <span className="h-2 w-2 rounded-full bg-warning" />
          <span className="text-warning font-semibold">Due</span>
          <span className="text-muted-foreground">— Current month pending</span>
        </div>

        {/* Overdue */}
        <div className="inline-flex items-center gap-1.5 text-xs">
          <span className="h-2 w-2 rounded-full bg-danger" />
          <span className="text-danger font-semibold">Overdue</span>
          <span className="text-muted-foreground">— Past renewal date</span>
        </div>
      </div>
    </div>
  );
}
