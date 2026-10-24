"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";
import type { CalendarDay } from "@/types/member-attendance";

interface AttendanceCalendarCardProps {
  selectedMonth: string; // YYYY-MM
  selectedMonthLabel: string; // e.g. "October 2026"
  previousMonth: string;
  nextMonth: string;
  days: CalendarDay[];
  consistencyScore: number;
  comparisonText: string | null;
  onNavigateMonth: (targetMonth: string) => void;
  isLoading?: boolean;
}

export function AttendanceCalendarCard({
  selectedMonthLabel,
  previousMonth,
  nextMonth,
  days,
  consistencyScore,
  comparisonText,
  onNavigateMonth,
  isLoading = false,
}: AttendanceCalendarCardProps) {
  const [selectedDay, setSelectedDay] = React.useState<CalendarDay | null>(null);

  const weekdayHeaders = ["M", "T", "W", "T", "F", "S", "S"];

  const handleDayClick = (day: CalendarDay) => {
    if (selectedDay?.dateStr === day.dateStr) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#BAC8BF] transition-all">
      {/* 1. Header with Month navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-primary shadow-2xs">
            <CalendarIcon className="h-4 w-4 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-foreground">
              {selectedMonthLabel}
            </h2>
            <p className="text-[11px] text-[#718078] font-medium">
              Activity and check-in timeline
            </p>
          </div>
        </div>

        {/* Previous / Next Month Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onNavigateMonth(previousMonth)}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-[#718078] hover:bg-[#F5F8F6] hover:text-[#14211D] transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Previous month"
            title="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateMonth(nextMonth)}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-[#718078] hover:bg-[#F5F8F6] hover:text-[#14211D] transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Next month"
            title="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Consistency Matrix Section Title & Legend */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="font-semibold text-foreground">
          Consistency Matrix
        </span>
        <div className="flex items-center gap-3 text-[11px] text-[#718078]">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-xs border border-border bg-[#F9FBFA]" />
            <span>Rest</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-xs border border-primary/40 bg-accent" />
            <span>Checked In</span>
          </div>
        </div>
      </div>

      {/* 3. Seven-Column Calendar Grid */}
      <div className="space-y-1.5">
        {/* Weekday Row */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-[#718078]">
          {weekdayHeaders.map((head, idx) => (
            <div key={idx} className="py-1">
              {head}
            </div>
          ))}
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day, idx) => {
            const isSelected = selectedDay?.dateStr === day.dateStr;

            // Cell styling according to status
            let cellStyle = "bg-[#F9FBFA] border border-border/80 text-[#14211D] hover:border-[#BAC8BF]";

            if (!day.isCurrentMonth) {
              cellStyle = "bg-transparent border border-transparent text-[#BAC8BF] hover:text-[#718078]";
            } else if (day.isFuture) {
              cellStyle = "bg-[#F5F8F6]/40 border border-border/40 text-[#BAC8BF] cursor-default";
            } else if (day.hasAttendance) {
              cellStyle = "bg-accent border border-primary/35 text-primary font-bold shadow-2xs hover:border-primary";
            }

            if (isSelected) {
              cellStyle += " ring-2 ring-primary border-primary";
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDayClick(day)}
                disabled={day.isFuture && !day.isCurrentMonth}
                className={`relative flex flex-col items-center justify-center rounded-xl py-2 h-10 w-full transition-all cursor-pointer ${cellStyle}`}
                title={`${day.dateStr}${day.hasAttendance ? " - Checked in" : day.isFuture ? " - Future date" : " - No visit"}`}
              >
                <span className="text-xs leading-none">
                  {day.dayNumber}
                </span>

                {/* Small indicator dot for verified attendance (matches screenshot!) */}
                {day.hasAttendance && (
                  <span className="mt-1 h-1 w-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Selected Day Details Popover / Drawer */}
      {selectedDay && (
        <div className="rounded-2xl border border-primary/20 bg-accent/40 p-3.5 text-xs text-[#14211D] space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="font-bold">
              {new Date(selectedDay.dateStr).toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              className="text-[#718078] hover:text-[#14211D] p-1"
              aria-label="Close details"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {selectedDay.records.length > 0 ? (
            <div className="space-y-1.5">
              {selectedDay.records.map((rec, rIdx) => (
                <div
                  key={rIdx}
                  className="flex items-center justify-between rounded-xl bg-card border border-border px-3 py-1.5 shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#718078]" />
                    <span className="font-bold text-[#14211D]">
                      {rec.timeFormatted}
                    </span>
                    <span className="text-[#718078]">•</span>
                    <span className="text-[#718078]">{rec.methodLabel}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-success border border-success/20">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Verified</span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-[#718078] font-medium">
              {selectedDay.isFuture
                ? "Future calendar date."
                : "No attendance recorded for this date."}
            </p>
          )}
        </div>
      )}

      {/* 5. Monthly Consistency Score Strip at Bottom */}
      <div className="flex items-center justify-between rounded-2xl bg-[#F5F8F6] border border-border/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary stroke-[2.2]" />
          <span className="text-xs font-bold text-[#14211D]">
            Consistency Score: {consistencyScore}%
          </span>
        </div>

        {comparisonText && (
          <span className="inline-flex items-center rounded-full bg-card border border-primary/25 px-2.5 py-0.5 text-[11px] font-bold text-primary shadow-2xs">
            {comparisonText}
          </span>
        )}
      </div>
    </div>
  );
}
