"use client";

import * as React from "react";
import { QuickCheckInButton, type DemoMember } from "@/components/admin";
import { AttendanceSummaryCards } from "./attendance-summary-cards";
import { AttendanceToolbar } from "./attendance-toolbar";
import { AttendanceTable } from "./attendance-table";
import type {
  AttendanceRecord,
  AttendanceSummaryData,
  DateFilterOption,
  MethodFilterOption,
} from "@/types/attendance";

interface AttendanceViewProps {
  initialSummary: AttendanceSummaryData;
  initialRecords: AttendanceRecord[];
}

export function AttendanceView({
  initialSummary,
  initialRecords,
}: AttendanceViewProps) {
  const [records, setRecords] = React.useState<AttendanceRecord[]>(initialRecords);
  const [summary, setSummary] = React.useState<AttendanceSummaryData>(initialSummary);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState<DateFilterOption>("Today");
  const [selectedMethod, setSelectedMethod] = React.useState<MethodFilterOption>("All");

  // Handle successful manual check-in from QuickCheckInModal
  const handleCheckInSuccess = (member: DemoMember) => {
    const newRecord: AttendanceRecord = {
      id: `att-manual-${Date.now()}`,
      memberId: `mem-${member.code}`,
      memberName: member.name,
      memberCode: member.code,
      initials: member.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      checkInTime: "Just now",
      checkInDate: "Today",
      method: "Manual",
      membershipTier: "Standard Monthly",
      membershipStatus: "Active",
      status: "Verified",
      dateCategory: "Today",
    };

    setRecords((prev) => [newRecord, ...prev]);
    setSummary((prev) => ({
      ...prev,
      todayCount: prev.todayCount + 1,
    }));
  };

  // Filter records based on search, date, and method
  const filteredRecords = React.useMemo(() => {
    return records.filter((record) => {
      // 1. Search Query filter (matches name or code case-insensitively)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = record.memberName.toLowerCase().includes(query);
        const matchesCode = record.memberCode.toLowerCase().includes(query);
        if (!matchesName && !matchesCode) {
          return false;
        }
      }

      // 2. Date Filter
      if (selectedDate !== record.dateCategory) {
        return false;
      }

      // 3. Method Filter
      if (selectedMethod !== "All" && record.method !== selectedMethod) {
        return false;
      }

      return true;
    });
  }, [records, searchQuery, selectedDate, selectedMethod]);

  // Compute live counts per date bucket for the pills
  const counts = React.useMemo(() => {
    return {
      today: records.filter((r) => r.dateCategory === "Today").length,
      yesterday: records.filter((r) => r.dateCategory === "Yesterday").length,
      thisWeek: records.filter((r) => r.dateCategory === "This Week").length,
      thisMonth: records.filter((r) => r.dateCategory === "This Month").length,
    };
  }, [records]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Attendance Log
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage daily member check-ins.
          </p>
        </div>

        {/* Header Action: Manual Check-in button */}
        <div className="flex items-center gap-2.5">
          <QuickCheckInButton
            label="Manual Check-in"
            onCheckInSuccess={handleCheckInSuccess}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <AttendanceSummaryCards summary={summary} />

      {/* Toolbar */}
      <AttendanceToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedMethod={selectedMethod}
        onMethodChange={setSelectedMethod}
        counts={counts}
      />

      {/* Attendance Table / Mobile List */}
      <AttendanceTable records={filteredRecords} />
    </div>
  );
}
