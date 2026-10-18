"use client";

import * as React from "react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatusFilterOption } from "@/types/fees";

export interface StatusCounts {
  all: number;
  paid: number;
  due: number;
  overdue: number;
}

interface FeesToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: StatusFilterOption;
  onStatusChange: (status: StatusFilterOption) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  availableMonths: string[];
  counts: StatusCounts;
}

export function FeesToolbar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedMonth,
  onMonthChange,
  availableMonths,
  counts,
}: FeesToolbarProps) {
  const statusTabs: { label: string; value: StatusFilterOption; count: number }[] = [
    { label: "All Records", value: "All", count: counts.all },
    { label: "Paid", value: "Paid", count: counts.paid },
    { label: "Pending / Due", value: "Due", count: counts.due },
    { label: "Overdue", value: "Overdue", count: counts.overdue },
  ];

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Left: Search Input */}
      <div className="relative flex-1 max-w-md">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by member name or code..."
          className="h-10 w-full rounded-xl border border-border bg-[#F5F8F6] focus:bg-card pl-10 pr-12 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right: Status Pills & Month Selector */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Status Filter Pills */}
        <div className="flex items-center rounded-xl border border-border bg-[#F5F8F6] p-1 overflow-x-auto max-w-full">
          {statusTabs.map((tab) => {
            const isActive = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onStatusChange(tab.value)}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer select-none",
                  isActive
                    ? "bg-card text-foreground font-semibold shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px] font-semibold font-mono",
                    isActive
                      ? "bg-pale-mint text-primary"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Month Selector Dropdown */}
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="h-10 appearance-none rounded-xl border border-border bg-card pl-3.5 pr-9 text-xs sm:text-sm font-medium text-foreground hover:border-[#BAC8BF] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors shadow-xs"
          >
            {availableMonths.map((month) => (
              <option key={month} value={month} className="bg-card text-foreground">
                {month}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
