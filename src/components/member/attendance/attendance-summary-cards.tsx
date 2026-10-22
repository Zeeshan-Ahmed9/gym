"use client";

import * as React from "react";
import { ArrowUpRight, Flame, Award } from "lucide-react";
import type { MemberAttendanceSummary } from "@/types/member-attendance";

interface AttendanceSummaryCardsProps {
  summary: MemberAttendanceSummary;
}

export function AttendanceSummaryCards({ summary }: AttendanceSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      {/* CARD 1 — THIS MONTH */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#BAC8BF] transition-all">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#718078]">
            THIS MONTH
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-primary shadow-2xs">
            <ArrowUpRight className="h-4 w-4 stroke-[2.2]" />
          </div>
        </div>

        {/* Main Metric */}
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-[#14211D]">
              {summary.thisMonthVisits}
            </span>
            <span className="text-xs font-semibold text-[#718078]">
              / {summary.monthlyTarget} visits
            </span>
          </div>
        </div>

        {/* Target and Progress Bar */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#718078]">Monthly Target</span>
            <span className="text-primary font-bold">
              {summary.goalPercentage}% Reached
            </span>
          </div>
          <div className="w-full bg-[#E3EAE5] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, summary.goalPercentage))}%` }}
            />
          </div>
        </div>
      </div>

      {/* CARD 2 — CURRENT STREAK */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#BAC8BF] transition-all">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#718078]">
            CURRENT STREAK
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-primary shadow-2xs">
            <Flame className="h-4 w-4 fill-primary/30 stroke-primary" />
          </div>
        </div>

        {/* Main Metric */}
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-primary">
              {summary.currentStreak}
            </span>
            <span className="text-3xl font-extrabold tracking-tight text-[#14211D]">
              Days
            </span>
          </div>
          <p className="text-xs text-[#718078] font-medium">
            Active consistency streak
          </p>
        </div>

        {/* Bottom Badge: Best streak */}
        <div className="flex items-center justify-end pt-1">
          <div className="inline-flex items-center rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-bold text-[#14211D] shadow-2xs">
            Best: {summary.bestStreak} days
          </div>
        </div>
      </div>

      {/* CARD 3 — ALL-TIME VISITS */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#BAC8BF] transition-all">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#718078]">
            ALL-TIME VISITS
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-primary shadow-2xs">
            <Award className="h-4 w-4 stroke-[2.2]" />
          </div>
        </div>

        {/* Main Metric */}
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-[#14211D]">
              {summary.allTimeVisits}
            </span>
            <span className="text-xs font-semibold text-[#718078]">
              sessions
            </span>
          </div>
        </div>

        {/* Tier and Badge */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-[#718078] font-medium">
            {summary.membershipTier}
          </span>
          <span className="rounded-full bg-accent text-success border border-success/20 px-2.5 py-0.5 text-[11px] font-bold">
            {summary.regularBadge}
          </span>
        </div>
      </div>
    </div>
  );
}
