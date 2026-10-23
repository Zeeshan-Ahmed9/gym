"use client";

import * as React from "react";
import { Download, QrCode } from "lucide-react";

interface AttendancePageHeaderProps {
  gymName: string;
  onExportCsv: () => void;
  onScanQr: () => void;
  isExporting?: boolean;
}

export function AttendancePageHeader({
  gymName,
  onExportCsv,
  onScanQr,
  isExporting = false,
}: AttendancePageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      {/* Left: Club badge & Main heading */}
      <div className="space-y-1.5">
        {/* Club Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/80 border border-primary/25 px-3 py-1 text-xs font-semibold text-primary">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span>{gymName || "Downtown Flagship Club"}</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          My Attendance
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#718078] font-medium">
          Track your gym attendance history and workout consistency.
        </p>
      </div>

      {/* Right Actions: Export CSV and Scan QR */}
      <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
        {/* Export CSV Button */}
        <button
          type="button"
          onClick={onExportCsv}
          disabled={isExporting}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-xs hover:bg-[#F5F8F6] hover:border-[#BAC8BF] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
          title="Download attendance records as CSV"
        >
          <Download className="h-3.5 w-3.5 text-[#718078]" />
          <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
        </button>

        {/* Scan QR Button */}
        <button
          type="button"
          onClick={onScanQr}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer"
          title="Scan Turnstile QR"
        >
          <QrCode className="h-3.5 w-3.5 stroke-[2.2]" />
          <span>Scan QR</span>
        </button>
      </div>
    </div>
  );
}
