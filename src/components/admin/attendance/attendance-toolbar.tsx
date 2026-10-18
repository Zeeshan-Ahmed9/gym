"use client";

import * as React from "react";
import { Search, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateFilterOption, MethodFilterOption } from "@/types/attendance";

interface AttendanceToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedDate: DateFilterOption;
  onDateChange: (date: DateFilterOption) => void;
  selectedMethod: MethodFilterOption;
  onMethodChange: (method: MethodFilterOption) => void;
  counts?: {
    today: number;
    yesterday: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export function AttendanceToolbar({
  searchQuery,
  onSearchChange,
  selectedDate,
  onDateChange,
  selectedMethod,
  onMethodChange,
  counts = {
    today: 87,
    yesterday: 74,
    thisWeek: 524,
    thisMonth: 1840,
  },
}: AttendanceToolbarProps) {
  const dateOptions: { label: DateFilterOption; count: number }[] = [
    { label: "Today", count: counts.today },
    { label: "Yesterday", count: counts.yesterday },
    { label: "This Week", count: counts.thisWeek },
    { label: "This Month", count: counts.thisMonth },
  ];

  const methodOptions: MethodFilterOption[] = ["All", "QR Code", "Manual"];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
      {/* Left: Search input */}
      <div className="relative flex flex-1 items-center min-w-[260px] max-w-md">
        <div className="pointer-events-none absolute left-3.5 flex items-center text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search member by name or code..."
          className="h-10 w-full rounded-xl border border-border bg-[#F5F8F6] pl-10 pr-9 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-md bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Right: Date Filter Pills & Method Filter Dropdown/Pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Filter Segmented Pills */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-[#F5F8F6] p-1 overflow-x-auto scrollbar-none">
          {dateOptions.map(({ label, count }) => {
            const isSelected = selectedDate === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onDateChange(label)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150 select-none cursor-pointer",
                  isSelected
                    ? "bg-card text-foreground font-semibold shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{label}</span>
                <span
                  className={cn(
                    "text-[11px] font-mono px-1 rounded",
                    isSelected
                      ? "text-primary bg-pale-mint font-semibold"
                      : "text-muted-foreground/70"
                  )}
                >
                  {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Method Filter Toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-[#F5F8F6] p-1">
          <span className="hidden sm:inline-flex items-center pl-2 pr-1 text-xs font-medium text-muted-foreground">
            <Filter className="h-3 w-3 mr-1" />
          </span>
          {methodOptions.map((method) => {
            const isSelected = selectedMethod === method;
            return (
              <button
                key={method}
                type="button"
                onClick={() => onMethodChange(method)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150 select-none cursor-pointer",
                  isSelected
                    ? "bg-primary text-white font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {method}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
