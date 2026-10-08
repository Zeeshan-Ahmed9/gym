"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatusFilter, FeeFilter } from "@/types/member";

interface MembersToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  feeFilter: FeeFilter;
  onFeeFilterChange: (fee: FeeFilter) => void;
  counts: {
    all: number;
    active: number;
    expired: number;
    feeDue: number;
  };
}

export function MembersToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  feeFilter,
  onFeeFilterChange,
  counts,
}: MembersToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search members..."
          className="h-10 w-full rounded-xl border border-border bg-[#15191D] pl-10 pr-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Status Filter Tabs (All / Active / Expired) */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-[#15191D] p-1 text-xs">
          <button
            type="button"
            onClick={() => onStatusFilterChange("ALL")}
            className={cn(
              "rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer",
              statusFilter === "ALL"
                ? "bg-primary text-[#0B0D0F] shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All ({counts.all})
          </button>

          <button
            type="button"
            onClick={() => onStatusFilterChange("ACTIVE")}
            className={cn(
              "rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer",
              statusFilter === "ACTIVE"
                ? "bg-primary text-[#0B0D0F] shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Active ({counts.active})
          </button>

          <button
            type="button"
            onClick={() => onStatusFilterChange("EXPIRED")}
            className={cn(
              "rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer",
              statusFilter === "EXPIRED"
                ? "bg-primary text-[#0B0D0F] shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Expired ({counts.expired})
          </button>
        </div>

        {/* Fee Filter: All / Paid / Due */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="fee-filter" className="sr-only">
            Fee Status
          </label>
          <select
            id="fee-filter"
            value={feeFilter}
            onChange={(e) => onFeeFilterChange(e.target.value as FeeFilter)}
            className="h-9 rounded-xl border border-border bg-[#15191D] px-3 text-xs font-semibold text-foreground transition-colors focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Fees</option>
            <option value="PAID">Paid</option>
            <option value="DUE">Due ({counts.feeDue})</option>
          </select>
        </div>
      </div>
    </div>
  );
}
