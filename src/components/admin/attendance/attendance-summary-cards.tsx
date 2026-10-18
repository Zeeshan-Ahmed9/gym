"use client";

import * as React from "react";
import { Users, Calendar, QrCode, TrendingUp } from "lucide-react";
import type { AttendanceSummaryData } from "@/types/attendance";

interface AttendanceSummaryCardsProps {
  summary: AttendanceSummaryData;
}

export function AttendanceSummaryCards({ summary }: AttendanceSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* 1. TODAY'S ATTENDANCE */}
      <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Today&apos;s Attendance
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pale-mint border border-primary/20 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-sans">
              {summary.todayCount}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              check-ins
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-border text-xs">
          <span className="text-muted-foreground">Today&apos;s member check-ins</span>
          <div className="inline-flex items-center gap-1 font-semibold text-success text-xs">
            <TrendingUp className="h-3 w-3" />
            <span>+12% vs yesterday</span>
          </div>
        </div>
      </div>

      {/* 2. THIS MONTH */}
      <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Monthly Visits
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pale-mint border border-primary/20 text-primary">
              <Calendar className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-sans">
              {summary.monthCount.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              visits
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-border text-xs">
          <span className="text-muted-foreground">Total visits this month</span>
          <span className="font-medium text-muted-foreground">Pace on track</span>
        </div>
      </div>

      {/* 3. CHECK-IN METHODS BREAKDOWN */}
      <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs sm:col-span-2 lg:col-span-1">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              QR vs Manual Breakdown
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pale-mint border border-primary/20 text-primary">
              <QrCode className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-sans">
              {summary.qrPercentage}%
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              QR Member App
            </span>
          </div>

          {/* Dual-color Progress Bar */}
          <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="bg-primary transition-all duration-500 rounded-l-full"
              style={{ width: `${summary.qrPercentage}%` }}
              title={`QR Code: ${summary.qrPercentage}%`}
            />
            <div
              className="bg-[#BAC8BF] transition-all duration-500 rounded-r-full"
              style={{ width: `${summary.manualPercentage}%` }}
              title={`Manual: ${summary.manualPercentage}%`}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-border text-xs">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>{summary.qrPercentage}% QR Code</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-[#BAC8BF]" />
            <span>{summary.manualPercentage}% Manual</span>
          </div>
        </div>
      </div>
    </div>
  );
}
