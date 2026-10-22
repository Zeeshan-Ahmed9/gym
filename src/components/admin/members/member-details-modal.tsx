"use client";

import * as React from "react";
import Link from "next/link";
import {
  X,
  Phone,
  Mail,
  Calendar,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Clock,
  Loader2,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMemberDetailsAction } from "@/server/actions/member.actions";
import type {
  MemberDetails,
  MemberPaymentItem,
  MemberAttendanceItem,
} from "@/types/member";

export interface MemberDetailsModalProps {
  memberId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEditClick: (member: MemberDetails) => void;
  onDeleteClick: (member: MemberDetails) => void;
}

interface MemberDetailsBodyProps {
  memberId: string;
  onClose: () => void;
  onEditClick: (member: MemberDetails) => void;
  onDeleteClick: (member: MemberDetails) => void;
}

function MemberDetailsBody({
  memberId,
  onClose,
  onEditClick,
  onDeleteClick,
}: MemberDetailsBodyProps) {
  const [state, setState] = React.useState<{
    details: MemberDetails | null;
    isLoading: boolean;
    error: string | null;
  }>({
    details: null,
    isLoading: true,
    error: null,
  });

  React.useEffect(() => {
    let active = true;

    getMemberDetailsAction(memberId)
      .then((res) => {
        if (!active) return;
        if (res.success && res.data) {
          setState({
            details: res.data as MemberDetails,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            details: null,
            isLoading: false,
            error: res.error || "Failed to load member details.",
          });
        }
      })
      .catch(() => {
        if (!active) return;
        setState({
          details: null,
          isLoading: false,
          error: "Error loading member details.",
        });
      });

    return () => {
      active = false;
    };
  }, [memberId]);

  const { details, isLoading, error } = state;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pale-mint border border-primary/20 text-primary font-bold text-sm">
            {details?.initials || "M"}
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {details?.name || "Member Profile"}
            </h2>
            <span className="font-mono text-xs text-muted-foreground font-medium">
              {details?.memberCode || (isLoading ? "Loading..." : "—")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {details && (
            <>
              <button
                type="button"
                onClick={() => onEditClick(details)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-[#F5F8F6] hover:text-foreground transition-colors cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteClick(details)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-danger/25 bg-[#FDF2F2] px-3 py-1.5 text-xs font-semibold text-danger hover:bg-[#fae2e2] transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-card p-1.5 text-muted-foreground hover:bg-[#F5F8F6] hover:text-foreground transition-all cursor-pointer ml-1"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoading && (
          <div className="py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Loading member profile...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-xl border border-danger/25 bg-[#FDF2F2] p-4 text-xs text-danger flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {details && !isLoading && (
          <>
            {/* Summary Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-[#F5F8F6] p-3 space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Membership
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    details.membershipStatus === "ACTIVE"
                      ? "bg-[#E5F6EF] border border-success/25 text-success"
                      : "bg-[#FDF2F2] border border-danger/25 text-danger"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      details.membershipStatus === "ACTIVE" ? "bg-success" : "bg-danger"
                    )}
                  />
                  {details.membershipStatus === "ACTIVE" ? "Active" : "Expired"}
                </span>
              </div>

              <div className="rounded-xl border border-border bg-[#F5F8F6] p-3 space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Expiry Date
                </span>
                <span className="text-xs font-bold text-foreground block">
                  {details.expiryDate}
                </span>
              </div>

              <div className="rounded-xl border border-border bg-[#F5F8F6] p-3 space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Monthly Fee
                </span>
                <span className="text-xs font-bold text-foreground block">
                  Rs. {details.monthlyFee.toLocaleString()}
                </span>
              </div>

              <div className="rounded-xl border border-border bg-[#F5F8F6] p-3 space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Fee Status
                </span>
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      details.feeStatus === "PAID"
                        ? "bg-[#E5F6EF] border border-success/25 text-success"
                        : "bg-[#FEF7EC] border border-warning/25 text-warning"
                    )}
                  >
                    {details.feeStatus === "PAID" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {details.feeStatus === "PAID" ? "Paid" : "Due"}
                  </span>
                  {details.feeStatus === "DUE" && (
                    <Link
                      href={`/admin/fees?search=${encodeURIComponent(details.memberCode)}&record=${encodeURIComponent(details.memberCode)}`}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      Pay now →
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{details.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-foreground">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{details.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-foreground">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Joined on {details.startDate}</span>
                </div>
                <div className="flex items-center gap-2.5 text-foreground">
                  <QrCode className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Total Check-ins: {details.attendanceCount}</span>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Payment History
                </h4>
                <div className="flex items-center gap-2.5">
                  {details.lastPayment && (
                    <span className="hidden sm:inline text-xs text-muted-foreground">
                      Last paid: {details.lastPayment.date} (Rs.{" "}
                      {details.lastPayment.amount.toLocaleString()})
                    </span>
                  )}
                  {details.feeStatus === "DUE" && (
                    <Link
                      href={`/admin/fees?search=${encodeURIComponent(details.memberCode)}&record=${encodeURIComponent(details.memberCode)}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                    >
                      <Banknote className="h-3.5 w-3.5" />
                      <span>Record Payment</span>
                    </Link>
                  )}
                </div>
              </div>

              {details.payments && details.payments.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-[#F5F8F6] text-muted-foreground font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Month</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Method</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {details.payments.map((p: MemberPaymentItem) => (
                        <tr key={p.id}>
                          <td className="py-2.5 px-3 text-foreground font-medium">{p.date}</td>
                          <td className="py-2.5 px-3 text-muted-foreground">{p.month}</td>
                          <td className="py-2.5 px-3 font-semibold text-foreground">
                            Rs. {p.amount.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">{p.method}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F6EF] px-2 py-0.5 font-semibold text-success text-[11px]">
                              Paid
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-[#F5F8F6] p-6 text-center text-xs text-muted-foreground">
                  No payment records found for this member yet.
                </div>
              )}
            </div>

            {/* Recent Attendance */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recent Attendance ({details.recentAttendances?.length || 0})
              </h4>

              {details.recentAttendances && details.recentAttendances.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-[#F5F8F6] text-muted-foreground font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3 text-right">Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {details.recentAttendances.map((att: MemberAttendanceItem) => (
                        <tr key={att.id}>
                          <td className="py-2.5 px-3 text-foreground font-medium">{att.date}</td>
                          <td className="py-2.5 px-3 text-muted-foreground">{att.time}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="inline-flex items-center gap-1 text-primary font-medium">
                              <Clock className="h-3 w-3" />
                              {att.method}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-[#F5F8F6] p-6 text-center text-xs text-muted-foreground">
                  No check-ins recorded yet for this member.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end px-6 py-4 border-t border-border bg-card">
        <button
          type="button"
          onClick={onClose}
          className="h-10 px-5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary-foreground hover:bg-[#F5F8F6] hover:text-foreground transition-all cursor-pointer"
        >
          Close
        </button>
      </div>
    </>
  );
}

export function MemberDetailsModal({
  memberId,
  isOpen,
  onClose,
  onEditClick,
  onDeleteClick,
}: MemberDetailsModalProps) {
  // Handle Escape key
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !memberId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-[#17221D]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border border-border bg-card text-foreground shadow-2xl transition-all font-sans my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <MemberDetailsBody
          key={memberId}
          memberId={memberId}
          onClose={onClose}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      </div>
    </div>
  );
}
