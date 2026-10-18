"use client";

import * as React from "react";
import { Banknote, Hourglass, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react";
import type { FeesSummaryData } from "@/types/fees";

interface FeesSummaryCardsProps {
  summary: FeesSummaryData;
}

export function FeesSummaryCards({ summary }: FeesSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* 1. COLLECTED THIS MONTH */}
      <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Collected This Month
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pale-mint border border-primary/20 text-primary">
              <Banknote className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
              Rs. {summary.collectedMonth.toLocaleString()}
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-primary font-semibold">{summary.collectedCount} members</span>
            <span>cleared for this month</span>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Realization Rate</span>
          <span className="font-semibold text-primary">{summary.realizationRate}%</span>
        </div>
      </div>

      {/* 2. PENDING DUES */}
      <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Pending Dues
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEF7EC] border border-warning/20 text-warning">
              <Hourglass className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
              Rs. {summary.pendingDues.toLocaleString()}
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
            <span className="text-warning font-semibold">
              {summary.dueSoonCount + summary.overdueCount} members
            </span>
            <span>pending or overdue</span>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs">
          <span className="text-warning font-medium">{summary.dueSoonCount} due</span>
          <span className="text-danger font-medium">{summary.overdueCount} overdue</span>
        </div>
      </div>

      {/* 3. EXPECTED FEES */}
      <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs md:col-span-2 lg:col-span-1">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Expected Fees
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pale-mint border border-primary/20 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
              Rs. {summary.totalExpected.toLocaleString()}
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Monthly Target</span>
            <span className="font-semibold text-foreground">
              Rs. {summary.targetAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Clean Progress Bar */}
        <div className="mt-5 pt-3 border-t border-border space-y-1.5">
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, summary.realizationRate)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{summary.realizationRate}% Collected</span>
            <span className="text-primary font-medium">On track</span>
          </div>
        </div>
      </div>
    </div>
  );
}
