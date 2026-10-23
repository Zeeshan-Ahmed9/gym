"use client";

import * as React from "react";
import {
  Calendar,
  Flame,
  Check,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type {
  AttendanceStats,
  MembershipDetails,
  BodyMetricsData,
} from "@/types/member-dashboard";
import { LogWeightModal } from "./log-weight-modal";

interface MemberStatsCardsProps {
  attendance: AttendanceStats;
  membership: MembershipDetails;
  bodyMetrics: BodyMetricsData;
  memberId: string;
}

export function MemberStatsCards({
  attendance,
  membership,
  bodyMetrics: initialMetrics,
  memberId,
}: MemberStatsCardsProps) {
  const [metrics, setMetrics] = React.useState(initialMetrics);
  const [isLogModalOpen, setIsLogModalOpen] = React.useState(false);

  const handleWeightUpdated = (newWeight: number) => {
    setMetrics((prev) => {
      const starting = prev.startingWeight ?? newWeight;
      const change = newWeight - starting;
      const sign = change > 0 ? "+" : change < 0 ? "−" : "";
      return {
        ...prev,
        currentWeight: newWeight,
        startingWeight: starting,
        weightChange: change,
        weightChangeFormatted: `${sign}${Math.abs(change).toFixed(1)} kg`,
        trendPoints: [...prev.trendPoints, newWeight],
        hasMetrics: true,
      };
    });
  };

  // Sparkline generator for body metrics
  const renderSparkline = (points: number[]) => {
    // Default pleasant downward trend points if array has < 2 points
    const data = points.length >= 2 ? points : [76.0, 75.2, 74.5, 73.6, 72.8, 72.0];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const width = 160;
    const height = 28;

    const coords = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      // Invert Y so higher weight is at top, lower weight at bottom
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    });

    const pathD = `M ${coords.join(" L ")}`;

    return (
      <svg
        className="w-full h-7 overflow-visible mt-2"
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
      >
        <path
          d={pathD}
          stroke="#00B386"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* CARD 1: VISITS THIS MONTH */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#BAC8BF] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
              Visits This Month
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5F8F6] text-[#718078]">
              <Calendar className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {attendance.visitsThisMonth}
              </span>
              <span className="text-xs font-semibold text-[#718078]">
                / {attendance.monthlyGoal} visits
              </span>
            </div>

            <p className="text-xs font-semibold text-success">
              {attendance.goalPercentage}% of monthly goal reached
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#E3EAE5] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, attendance.goalPercentage)}%` }}
            />
          </div>
        </div>

        {/* CARD 2: CURRENT STREAK */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#BAC8BF] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
              Current Streak
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FEF3C7] text-warning">
              <Flame className="h-4 w-4 fill-warning" />
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {attendance.currentStreak} Days
            </div>
            <p className="text-xs font-semibold text-success">
              {attendance.streakMessage}
            </p>
          </div>

          {/* 7 Days of Current Week */}
          <div className="flex items-center justify-between gap-1 pt-1">
            {attendance.weekDays.map((day, idx) => (
              <div
                key={idx}
                className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-semibold transition-all ${
                  day.attended
                    ? "bg-primary text-white shadow-xs"
                    : "bg-[#F0F4F2] text-[#718078]"
                } ${day.isToday ? "ring-2 ring-primary/40 font-bold" : ""}`}
                title={`${day.dayName}: ${day.attended ? "Attended" : "No check-in"}`}
              >
                {day.dayLetter}
              </div>
            ))}
          </div>
        </div>

        {/* CARD 3: MEMBERSHIP */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#BAC8BF] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
              Membership
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
                membership.feeStatus === "PAID"
                  ? "bg-accent text-success border border-success/20"
                  : "bg-[#FEF7EC] text-warning border border-warning/20"
              }`}
            >
              {membership.feeStatus}
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="text-xs font-medium text-[#718078]">
              {membership.planName}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Rs. {membership.monthlyFee.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-[#718078]">
                {membership.billingPeriod}
              </span>
            </div>
          </div>

          {/* Dues & Renewal Info */}
          <div className="flex items-center justify-between text-xs text-[#718078] pt-1 border-t border-border/50">
            <span>
              Dues: <strong className="text-foreground font-semibold">Rs. {membership.duesAmount}</strong>
            </span>
            <span>{membership.renewsFormatted}</span>
          </div>
        </div>

        {/* CARD 4: BODY METRICS */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-[#BAC8BF] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
              Body Metrics
            </span>
            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Log →
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {metrics.currentWeight ? `${metrics.currentWeight.toFixed(1)}` : "72.0"}
                <span className="text-xs font-medium text-[#718078] ml-1">kg</span>
              </span>

              {/* Weight change badge */}
              <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-success inline-flex items-center gap-0.5">
                {metrics.weightChangeFormatted || "−4.0 kg"}
              </span>
            </div>

            <p className="text-[11px] text-[#718078] font-medium mt-0.5">
              Starting: {metrics.startingWeight ? `${metrics.startingWeight.toFixed(1)} kg` : "76.0 kg"} • Target:{" "}
              {metrics.targetWeight ? `${metrics.targetWeight.toFixed(1)} kg` : "70.0 kg"}
            </p>
          </div>

          {/* Trend Line Graphic */}
          <div className="pt-1">
            {renderSparkline(metrics.trendPoints)}
          </div>
        </div>
      </div>

      {/* Log Weight Modal */}
      <LogWeightModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        memberId={memberId}
        currentWeight={metrics.currentWeight ?? 72.0}
        onSuccess={handleWeightUpdated}
      />
    </>
  );
}
