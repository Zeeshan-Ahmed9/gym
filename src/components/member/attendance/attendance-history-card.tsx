"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  QrCode,
  UserCheck,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import type { AttendanceHistoryItem } from "@/types/member-attendance";

interface AttendanceHistoryCardProps {
  records: AttendanceHistoryItem[];
  totalInMonth: number;
  totalAllTime: number;
  sort: "newest" | "oldest";
  onSortChange: (sort: "newest" | "oldest") => void;
  onScanQr: () => void;
  isLoading?: boolean;
}

export function AttendanceHistoryCard({
  records,
  totalInMonth,
  totalAllTime,
  sort,
  onSortChange,
  onScanQr,
  isLoading = false,
}: AttendanceHistoryCardProps) {
  const [showFullArchive, setShowFullArchive] = React.useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = React.useState(false);

  // Default display page size = 6 (matches screenshot showing 6 records)
  const defaultPageSize = 6;
  const displayedRecords = showFullArchive
    ? records
    : records.slice(0, defaultPageSize);

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-[#BAC8BF] transition-all h-full">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#14211D]">
            Attendance History Records
          </h2>
          <p className="text-xs text-[#718078] font-medium mt-0.5">
            Turnstile and front desk validated check-ins
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="relative self-start sm:self-auto flex items-center gap-2">
          <span className="text-xs text-[#718078] font-medium">Sort:</span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-[#14211D] shadow-2xs hover:bg-[#F5F8F6] transition-colors cursor-pointer"
            >
              <span>{sort === "newest" ? "Newest First" : "Oldest First"}</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#718078]" />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-20 w-36 rounded-2xl border border-border bg-card p-1 shadow-lg text-xs font-semibold animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => {
                    onSortChange("newest");
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                    sort === "newest"
                      ? "bg-accent text-primary font-bold"
                      : "text-[#14211D] hover:bg-[#F5F8F6]"
                  }`}
                >
                  Newest First
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSortChange("oldest");
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                    sort === "oldest"
                      ? "bg-accent text-primary font-bold"
                      : "text-[#14211D] hover:bg-[#F5F8F6]"
                  }`}
                >
                  Oldest First
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Records Table */}
      {displayedRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
            <CalendarIcon className="h-6 w-6 stroke-[2]" />
          </div>
          <div className="space-y-1 max-w-sm">
            <p className="text-sm font-bold text-[#14211D]">
              No Attendance Records Yet
            </p>
            <p className="text-xs text-[#718078]">
              Scan the gym turnstile QR code during your next visit to get started.
            </p>
          </div>
          <button
            type="button"
            onClick={onScanQr}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition-all cursor-pointer mt-2"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Scan QR Now</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-border/70 text-[11px] font-extrabold uppercase tracking-wider text-[#718078]">
                <th className="py-2.5 pr-4 pl-1 font-extrabold">DATE & DAY</th>
                <th className="py-2.5 px-4 font-extrabold">TIME</th>
                <th className="py-2.5 px-4 font-extrabold">ENTRY METHOD</th>
                <th className="py-2.5 pr-1 pl-4 text-right font-extrabold">STATUS</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-border/60 text-xs">
              {displayedRecords.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#F9FBFA] transition-colors group"
                >
                  {/* Column 1: Date & Day */}
                  <td className="py-3.5 pr-4 pl-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary shadow-2xs">
                        <CalendarIcon className="h-4 w-4 stroke-[2.2]" />
                      </div>
                      <div className="leading-tight">
                        <span className="font-extrabold text-[#14211D] text-xs sm:text-sm block">
                          {item.dateFormatted}
                        </span>
                        <span className="text-[11px] text-[#718078] font-medium block">
                          {item.dayOfWeek}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Time */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-semibold text-[#14211D]">
                      <Clock className="h-3.5 w-3.5 text-[#718078]" />
                      <span>{item.timeFormatted}</span>
                    </div>
                  </td>

                  {/* Column 3: Entry Method */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {item.method === "QR" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-accent px-2.5 py-1 text-xs font-semibold text-primary">
                        <QrCode className="h-3 w-3 stroke-[2.2]" />
                        <span>{item.methodLabel}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-[#F5F8F6] px-2.5 py-1 text-xs font-semibold text-[#34433D]">
                        <UserCheck className="h-3 w-3 text-[#718078]" />
                        <span>{item.methodLabel}</span>
                      </span>
                    )}
                  </td>

                  {/* Column 4: Status */}
                  <td className="py-3.5 pr-1 pl-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-success">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <span>{item.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Footer Row: Count & View full archive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/80 text-xs">
        <span className="text-[#718078] font-medium">
          Showing {displayedRecords.length} of {totalInMonth} records this month
        </span>

        {records.length > defaultPageSize && (
          <button
            type="button"
            onClick={() => setShowFullArchive(!showFullArchive)}
            className="inline-flex items-center gap-1 font-bold text-primary hover:underline cursor-pointer transition-colors"
          >
            <span>
              {showFullArchive ? "Show recent only ↑" : "View full archive →"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
