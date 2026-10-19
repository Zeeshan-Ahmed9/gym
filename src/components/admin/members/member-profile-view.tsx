"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EditMemberModal } from "./edit-member-modal";
import { DeleteMemberModal } from "./delete-member-modal";
import { useRouter } from "next/navigation";
import type {
  MemberDetails,
  MemberPaymentItem,
  MemberAttendanceItem,
} from "@/types/member";

export interface MemberProfileViewProps {
  details: MemberDetails;
}

export function MemberProfileView({ details }: MemberProfileViewProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/members"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
            aria-label="Back to Members"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {details.name}
              </h1>
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
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              Member Code: <span className="font-semibold text-foreground">{details.memberCode}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs sm:text-sm font-semibold text-secondary-foreground hover:bg-[#F5F8F6] hover:text-foreground transition-colors cursor-pointer shadow-xs"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Member</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-danger/25 bg-[#FDF2F2] px-3.5 py-2 text-xs sm:text-sm font-semibold text-danger hover:bg-[#fae2e2] transition-colors cursor-pointer shadow-xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Membership Status
          </span>
          <span className="text-sm font-bold text-foreground block">
            {details.membershipStatus === "ACTIVE" ? "Active Passport" : "Expired"}
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Expiry Date
          </span>
          <span className="text-sm font-bold text-foreground block">
            {details.expiryDate}
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Monthly Fee
          </span>
          <span className="text-sm font-bold text-foreground block">
            Rs. {details.monthlyFee.toLocaleString()}
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Fee Status
          </span>
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
        </div>
      </div>

      {/* Contact & Attendance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Contact Information
          </h3>
          <div className="space-y-2.5 text-xs">
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
              <span>Membership started on {details.startDate}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Attendance Summary
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2.5 text-foreground">
              <QrCode className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Total Recorded Check-ins: <strong>{details.attendanceCount}</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-foreground">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>
                Recent Check-in:{" "}
                {details.recentAttendances?.[0]
                  ? `${details.recentAttendances[0].date} at ${details.recentAttendances[0].time}`
                  : "No check-ins yet"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">
            Payment History
          </h3>
          {details.lastPayment && (
            <span className="text-xs text-muted-foreground">
              Latest payment: {details.lastPayment.date} (Rs. {details.lastPayment.amount.toLocaleString()})
            </span>
          )}
        </div>

        {details.payments && details.payments.length > 0 ? (
          <div className="overflow-x-auto">
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
          <div className="rounded-xl border border-dashed border-border bg-[#F5F8F6] p-8 text-center text-xs text-muted-foreground">
            No payments recorded yet for this member.
          </div>
        )}
      </div>

      {/* Attendance History */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-foreground">
          Recent Attendance Log
        </h3>

        {details.recentAttendances && details.recentAttendances.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-[#F5F8F6] text-muted-foreground font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Check-in Time</th>
                  <th className="py-2.5 px-3 text-right">Verification Method</th>
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
          <div className="rounded-xl border border-dashed border-border bg-[#F5F8F6] p-8 text-center text-xs text-muted-foreground">
            No check-in records found for this member yet.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditMemberModal
        member={details}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* Delete Modal */}
      <DeleteMemberModal
        member={details}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={() => {
          router.push("/admin/members");
        }}
      />
    </div>
  );
}
