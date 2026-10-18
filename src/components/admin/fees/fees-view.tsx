"use client";

import * as React from "react";
import { Plus, CheckCircle2, X } from "lucide-react";
import { FeesSummaryCards } from "./fees-summary-cards";
import { FeesStatusGuide } from "./fees-status-guide";
import { FeesToolbar, type StatusCounts } from "./fees-toolbar";
import { FeesTable } from "./fees-table";
import { RecordPaymentModal, type RecordPaymentPayload } from "./record-payment-modal";
import { ViewPaymentModal } from "./view-payment-modal";
import type {
  FeeRecord,
  FeesSummaryData,
  StatusFilterOption,
  DemoMemberOption,
} from "@/types/fees";

interface FeesViewProps {
  initialSummary: FeesSummaryData;
  initialRecords: FeeRecord[];
  demoMembers: DemoMemberOption[];
}

const AVAILABLE_MONTHS = [
  "All Months",
  "November 2024",
  "October 2024",
  "September 2024",
];

export function FeesView({
  initialSummary,
  initialRecords,
  demoMembers,
}: FeesViewProps) {
  const [records, setRecords] = React.useState<FeeRecord[]>(initialRecords);
  const [summary, setSummary] = React.useState<FeesSummaryData>(initialSummary);

  // Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<StatusFilterOption>("All");
  const [selectedMonth, setSelectedMonth] = React.useState("November 2024");

  // Modals
  const [isRecordModalOpen, setIsRecordModalOpen] = React.useState(false);
  const [prefilledRecord, setPrefilledRecord] = React.useState<FeeRecord | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [viewRecord, setViewRecord] = React.useState<FeeRecord | null>(null);

  // Success Feedback Toast
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Open modal without prefilled record
  const handleOpenNewPayment = () => {
    setPrefilledRecord(null);
    setIsRecordModalOpen(true);
  };

  // Open modal with prefilled record from a row
  const handleOpenRowPayment = (record: FeeRecord) => {
    setPrefilledRecord(record);
    setIsRecordModalOpen(true);
  };

  // Open view modal for a paid record
  const handleOpenViewRecord = (record: FeeRecord) => {
    setViewRecord(record);
    setIsViewModalOpen(true);
  };

  // Save payment handler
  const handleSavePayment = (payload: RecordPaymentPayload) => {
    let updatedRecords: FeeRecord[];

    if (payload.targetRecordId) {
      // Update existing record
      updatedRecords = records.map((r) => {
        if (r.id === payload.targetRecordId) {
          return {
            ...r,
            amount: payload.amount,
            month: payload.month,
            paymentDate: payload.paymentDate,
            method: payload.method,
            status: "Paid" as const,
          };
        }
        return r;
      });
    } else {
      // Check if there is an existing due/overdue record for this member & month
      const existingIdx = records.findIndex(
        (r) =>
          r.memberId === payload.memberId &&
          r.month === payload.month &&
          r.status !== "Paid"
      );

      if (existingIdx !== -1) {
        updatedRecords = records.map((r, i) => {
          if (i === existingIdx) {
            return {
              ...r,
              amount: payload.amount,
              paymentDate: payload.paymentDate,
              method: payload.method,
              status: "Paid" as const,
            };
          }
          return r;
        });
      } else {
        // Create new paid record
        const newRecord: FeeRecord = {
          id: `fee-${Date.now()}`,
          memberId: payload.memberId,
          memberName: payload.memberName,
          memberCode: payload.memberCode,
          initials: payload.memberName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
          tier: payload.tier,
          amount: payload.amount,
          month: payload.month,
          paymentDate: payload.paymentDate,
          method: payload.method,
          status: "Paid",
        };
        updatedRecords = [newRecord, ...records];
      }
    }

    setRecords(updatedRecords);

    // Update summary values
    setSummary((prev) => {
      const newCollected = prev.collectedMonth + payload.amount;
      const newPending = Math.max(0, prev.pendingDues - payload.amount);
      const newTotal = prev.totalExpected;
      const newRate = Math.round((newCollected / (newTotal || 1)) * 100);

      return {
        ...prev,
        collectedMonth: newCollected,
        collectedCount: prev.collectedCount + 1,
        pendingDues: newPending,
        dueSoonCount: Math.max(0, prev.dueSoonCount - 1),
        realizationRate: Math.min(100, newRate),
      };
    });

    // Show feedback toast
    setSuccessMessage(
      `Payment of Rs. ${payload.amount.toLocaleString()} for ${payload.memberName} (${payload.month}) has been recorded.`
    );
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  // Filter records based on search, status, and month
  const filteredRecords = React.useMemo(() => {
    return records.filter((record) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = record.memberName.toLowerCase().includes(query);
        const matchesCode = record.memberCode.toLowerCase().includes(query);
        if (!matchesName && !matchesCode) {
          return false;
        }
      }

      // 2. Month Selector
      if (selectedMonth !== "All Months" && record.month !== selectedMonth) {
        return false;
      }

      // 3. Status Filter
      if (selectedStatus !== "All" && record.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [records, searchQuery, selectedMonth, selectedStatus]);

  // Compute live counts for toolbar pills based on current month filter
  const counts: StatusCounts = React.useMemo(() => {
    const monthRecords =
      selectedMonth === "All Months"
        ? records
        : records.filter((r) => r.month === selectedMonth);

    return {
      all: monthRecords.length,
      paid: monthRecords.filter((r) => r.status === "Paid").length,
      due: monthRecords.filter((r) => r.status === "Due").length,
      overdue: monthRecords.filter((r) => r.status === "Overdue").length,
    };
  }, [records, selectedMonth]);

  return (
    <div className="space-y-6">
      {/* Success Notification Banner / Toast */}
      {successMessage && (
        <div className="flex items-center justify-between rounded-xl bg-accent px-4 py-3 text-sm text-success animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="p-1 text-success/80 hover:text-success cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Fees & Payments
          </h1>
          <p className="mt-1 text-sm text-secondary-foreground">
            Track membership fees, payments, and outstanding dues.
          </p>
        </div>

        {/* Header Action: + Record Payment */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenNewPayment}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <FeesSummaryCards summary={summary} />

      {/* Status Guide */}
      <FeesStatusGuide />

      {/* Search and Filters Toolbar */}
      <FeesToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        availableMonths={AVAILABLE_MONTHS}
        counts={counts}
      />

      {/* Records Table & Mobile Cards */}
      <FeesTable
        records={filteredRecords}
        onViewRecord={handleOpenViewRecord}
        onRecordPayment={handleOpenRowPayment}
      />

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSavePayment={handleSavePayment}
        demoMembers={demoMembers}
        prefilledRecord={prefilledRecord}
        availableMonths={AVAILABLE_MONTHS}
      />

      {/* View Payment Modal */}
      <ViewPaymentModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        record={viewRecord}
      />
    </div>
  );
}
