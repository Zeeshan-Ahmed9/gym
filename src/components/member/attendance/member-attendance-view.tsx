"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { MemberAttendanceData } from "@/types/member-attendance";
import { AttendancePageHeader } from "./attendance-page-header";
import { AttendanceSummaryCards } from "./attendance-summary-cards";
import { AttendanceCalendarCard } from "./attendance-calendar-card";
import { PreferredWindowCard } from "./preferred-window-card";
import { AttendanceHistoryCard } from "./attendance-history-card";
import { QrScannerModal } from "@/components/member/qr-scanner-modal";
import { fetchAttendanceDataAction } from "@/server/actions/member-attendance.actions";

interface MemberAttendanceViewProps {
  initialData: MemberAttendanceData;
}

export function MemberAttendanceView({ initialData }: MemberAttendanceViewProps) {
  const router = useRouter();
  const [data, setData] = React.useState<MemberAttendanceData>(initialData);
  const [sort, setSort] = React.useState<"newest" | "oldest">("newest");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  // Sync with initialData changes on revalidation
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Navigate to another calendar month
  const handleNavigateMonth = async (targetMonth: string) => {
    setIsLoading(true);
    try {
      const res = await fetchAttendanceDataAction({
        month: targetMonth,
        sort,
      });
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load month attendance:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-sort records
  const handleSortChange = async (newSort: "newest" | "oldest") => {
    setSort(newSort);
    setIsLoading(true);
    try {
      const res = await fetchAttendanceDataAction({
        month: data.calendar.selectedMonth,
        sort: newSort,
      });
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to re-sort attendance:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Export CSV
  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const records = data.history.records;
      const headers = ["Date", "Day", "Check-in Time", "Entry Method", "Status"];
      const rows = records.map((r) => [
        `"${r.dateFormatted.replace(/"/g, '""')}"`,
        `"${r.dayOfWeek.replace(/"/g, '""')}"`,
        `"${r.timeFormatted.replace(/"/g, '""')}"`,
        `"${r.methodLabel.replace(/"/g, '""')}"`,
        `"${r.status.replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `fitflow-attendance-${data.calendar.selectedMonth}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export CSV failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // QR Scan Success Handler
  const handleScanSuccess = async (info: { checkInTime: string; gate: string }) => {
    // Refresh data from server to update streak, summary, and history
    setIsLoading(true);
    try {
      const res = await fetchAttendanceDataAction({
        month: data.calendar.selectedMonth,
        sort,
      });
      if (res.success && res.data) {
        setData(res.data);
      }
      router.refresh();
    } catch (err) {
      console.error("Failed to refresh attendance after scan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* 1. Page Header with Club Badge and Action Buttons */}
      <AttendancePageHeader
        gymName={data.gymName}
        onExportCsv={handleExportCsv}
        onScanQr={() => setIsScannerOpen(true)}
        isExporting={isExporting}
      />

      {/* 2. Three Attendance Summary Cards (This Month, Current Streak, All-Time Visits) */}
      <AttendanceSummaryCards summary={data.summary} />

      {/* 3. Main Two-Column Layout (Calendar & Preferred Window on left ~40%, History on right ~60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: Calendar + Preferred Check-in Window (~40% / 5 cols) */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          <AttendanceCalendarCard
            selectedMonth={data.calendar.selectedMonth}
            selectedMonthLabel={data.calendar.selectedMonthLabel}
            previousMonth={data.calendar.previousMonth}
            nextMonth={data.calendar.nextMonth}
            days={data.calendar.days}
            consistencyScore={data.calendar.consistencyScore}
            comparisonText={data.calendar.comparisonText}
            onNavigateMonth={handleNavigateMonth}
            isLoading={isLoading}
          />

          <PreferredWindowCard
            peakTimeLabel={data.preferredWindow.peakTimeLabel}
            hasData={data.preferredWindow.hasData}
            distribution={data.preferredWindow.distribution}
          />
        </div>

        {/* Right Column: Attendance History Records (~60% / 7 cols) */}
        <div className="lg:col-span-7">
          <AttendanceHistoryCard
            records={data.history.records}
            totalInMonth={data.history.totalInMonth}
            totalAllTime={data.history.totalAllTime}
            sort={sort}
            onSortChange={handleSortChange}
            onScanQr={() => setIsScannerOpen(true)}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Shared QrScannerModal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        memberId={data.member.id}
        onSuccess={handleScanSuccess}
      />
    </div>
  );
}
