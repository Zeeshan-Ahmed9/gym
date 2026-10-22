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
import { format, subMonths, addMonths } from "date-fns";
import { useRouter } from "next/navigation";

interface FeesViewProps {
  initialSummary: FeesSummaryData;
  initialRecords: FeeRecord[];
  demoMembers: DemoMemberOption[];
  initialSearch?: string;
  initialRecordCode?: string;
}

export function FeesView({
  initialSummary,
  initialRecords,
  demoMembers,
  initialSearch = "",
  initialRecordCode = "",
}: FeesViewProps) {
  const router = useRouter();

  // Dynamic available months list around current date
  const availableMonths = React.useMemo(() => {
    const now = new Date();
    const list = ["All Months"];
    list.push(format(addMonths(now, 1), "MMMM yyyy"));
    list.push(format(now, "MMMM yyyy"));
    for (let i = 1; i <= 5; i++) {
      list.push(format(subMonths(now, i), "MMMM yyyy"));
    }
    return list;
  }, []);

  const records = initialRecords;
  const summary = initialSummary;

  // Filters
  const [searchQuery, setSearchQuery] = React.useState(initialSearch);
  const [selectedStatus, setSelectedStatus] = React.useState<StatusFilterOption>("All");
  const [selectedMonth, setSelectedMonth] = React.useState<string>("All Months");

  // Modals
  const [isRecordModalOpen, setIsRecordModalOpen] = React.useState(false);
  const [prefilledRecord, setPrefilledRecord] = React.useState<FeeRecord | null>(null);

  // Auto-open record payment modal if initialRecordCode is provided
  React.useEffect(() => {
    if (initialRecordCode) {
      const match = records.find(
        (r) =>
          r.memberCode.toLowerCase() === initialRecordCode.toLowerCase() ||
          r.memberId === initialRecordCode
      );
      if (match) {
        setPrefilledRecord(match);
        setIsRecordModalOpen(true);
      }
    }
  }, [initialRecordCode, records]);

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

  // Save payment callback
  const handleSavePayment = (payload: RecordPaymentPayload) => {
    setSuccessMessage(
      `Payment of Rs. ${payload.amount.toLocaleString()} for ${payload.memberName} has been saved to the database.`
    );
    router.refresh();
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
        <div className="flex items-center justify-between rounded-xl bg-accent border border-primary/25 px-4 py-3 text-sm text-success animate-in fade-in slide-in-from-top-2 duration-200">
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
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all shadow-xs cursor-pointer select-none"
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
        availableMonths={availableMonths}
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
        availableMonths={availableMonths}
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
