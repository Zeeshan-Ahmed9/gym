"use client";

import * as React from "react";
import { X, CheckCircle2, Banknote, Building2, CreditCard, Calendar, ShieldCheck } from "lucide-react";
import type { FeeRecord } from "@/types/fees";

interface ViewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: FeeRecord | null;
}

export function ViewPaymentModal({
  isOpen,
  onClose,
  record,
}: ViewPaymentModalProps) {
  if (!isOpen || !record) return null;

  const MethodIcon =
    record.method === "Bank Transfer"
      ? Building2
      : record.method === "Other"
      ? CreditCard
      : Banknote;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-payment-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#17221D]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 text-foreground shadow-xl transition-all font-sans">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-[#F5F8F6] hover:text-foreground transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="pr-10 pb-4 border-b border-border">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-primary mb-2">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Record Details</span>
          </div>
          <h2
            id="view-payment-title"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            Payment Record
          </h2>
          <p className="mt-1 text-sm text-secondary-foreground">
            View transaction and membership fee details.
          </p>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          {/* Member Card */}
          <div className="rounded-xl border border-border bg-[#F5F8F6] p-4 flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary text-sm font-bold">
              {record.initials}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground text-sm truncate">
                {record.memberName}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center rounded border border-border bg-card px-2 py-0.5 font-mono text-xs font-medium text-secondary-foreground">
                  {record.memberCode}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {record.tier}
                </span>
              </div>
            </div>
          </div>

          {/* Amount Highlight */}
          <div className="rounded-xl border border-border bg-[#F5F8F6] p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground block">
                Amount Paid
              </span>
              <span className="text-2xl font-bold text-foreground mt-0.5 block">
                Rs. {record.amount.toLocaleString()}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span>Paid</span>
            </span>
          </div>

          {/* Details Grid */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-secondary-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>Membership Month</span>
              </span>
              <span className="font-semibold text-foreground">{record.month}</span>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-border">
              <span className="text-secondary-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Payment Date</span>
              </span>
              <span className="font-medium text-foreground">
                {record.paymentDate || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-border">
              <span className="text-secondary-foreground flex items-center gap-1.5">
                <MethodIcon className="h-3.5 w-3.5 text-primary" />
                <span>Payment Method</span>
              </span>
              <span className="font-medium text-foreground">
                {record.method || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-border">
              <span className="text-secondary-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-success" />
                <span>Verification</span>
              </span>
              <span className="font-medium text-success">
                Local Record Verified
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto h-10 px-5 rounded-xl border border-border bg-card text-xs sm:text-sm font-semibold text-secondary-foreground hover:bg-[#F5F8F6] hover:text-foreground active:scale-[0.98] transition-all cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
