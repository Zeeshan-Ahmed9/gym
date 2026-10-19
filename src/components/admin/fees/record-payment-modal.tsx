"use client";

import * as React from "react";
import { X, Check, Banknote, Building2, CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentMethodType, DemoMemberOption, FeeRecord } from "@/types/fees";
import { recordPaymentAction } from "@/server/actions/fees.actions";

export interface RecordPaymentPayload {
  memberId: string;
  memberName: string;
  memberCode: string;
  tier: string;
  amount: number;
  month: string;
  paymentDate: string;
  method: PaymentMethodType;
  targetRecordId?: string;
}

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (payload: RecordPaymentPayload) => void;
  demoMembers: DemoMemberOption[];
  prefilledRecord?: FeeRecord | null;
  availableMonths: string[];
}

export function RecordPaymentModal({
  isOpen,
  onClose,
  onSavePayment,
  demoMembers,
  prefilledRecord,
  availableMonths,
}: RecordPaymentModalProps) {
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="record-payment-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#17221D]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl transition-all font-sans animate-in fade-in zoom-in-95 duration-200">
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
            <Banknote className="h-3.5 w-3.5" />
            <span>Fee Collection</span>
          </div>
          <h2
            id="record-payment-title"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            Record Payment
          </h2>
          <p className="mt-1 text-sm text-secondary-foreground">
            Record a membership fee payment and persist to database.
          </p>
        </div>

        {demoMembers.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Banknote className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No Registered Members</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Please add at least one member in the Members section before recording a payment.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary-foreground hover:bg-[#F5F8F6] cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <RecordPaymentForm
            onClose={onClose}
            onSavePayment={onSavePayment}
            demoMembers={demoMembers}
            prefilledRecord={prefilledRecord}
            availableMonths={availableMonths}
          />
        )}
      </div>
    </div>
  );
}

function RecordPaymentForm({
  onClose,
  onSavePayment,
  demoMembers,
  prefilledRecord,
  availableMonths,
}: {
  onClose: () => void;
  onSavePayment: (payload: RecordPaymentPayload) => void;
  demoMembers: DemoMemberOption[];
  prefilledRecord?: FeeRecord | null;
  availableMonths: string[];
}) {
  const initialMonth =
    prefilledRecord?.month ||
    availableMonths.find((m) => m !== "All Months") ||
    "October 2026";

  const initialMemberId =
    prefilledRecord?.memberId || (demoMembers.length > 0 ? demoMembers[0].id : "");

  const initialAmount =
    prefilledRecord?.amount ??
    (demoMembers.length > 0 ? demoMembers[0].defaultAmount : 3000);

  const [selectedMemberId, setSelectedMemberId] = React.useState(initialMemberId);
  const [amount, setAmount] = React.useState<number | "">(initialAmount);
  const [month, setMonth] = React.useState(initialMonth);
  const [paymentDate, setPaymentDate] = React.useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [method, setMethod] = React.useState<PaymentMethodType>(
    prefilledRecord?.method || "Cash"
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [errors, setErrors] = React.useState<{
    member?: string;
    amount?: string;
    month?: string;
    paymentDate?: string;
    method?: string;
    general?: string;
  }>({});

  const handleMemberChange = (id: string) => {
    setSelectedMemberId(id);
    const member = demoMembers.find((m) => m.id === id);
    if (member && !prefilledRecord) {
      setAmount(member.defaultAmount);
    }
    if (errors.member) {
      setErrors((prev) => ({ ...prev, member: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!selectedMemberId) {
      newErrors.member = "Member is required.";
    }

    if (amount === "" || Number(amount) <= 0 || isNaN(Number(amount))) {
      newErrors.amount = "Amount must be greater than zero.";
    }

    if (!month) {
      newErrors.month = "Membership month is required.";
    }

    if (!paymentDate) {
      newErrors.paymentDate = "Payment date is required.";
    }

    if (!method) {
      newErrors.method = "Payment method is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const member = demoMembers.find((m) => m.id === selectedMemberId);
    if (!member) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await recordPaymentAction({
        memberId: member.id,
        amount: Number(amount),
        month,
        paymentDate,
        paymentMethod: method,
      });

      if (res.success) {
        let formattedDate = paymentDate;
        try {
          const d = new Date(paymentDate);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          }
        } catch {
          formattedDate = paymentDate;
        }

        onSavePayment({
          memberId: member.id,
          memberName: member.name,
          memberCode: member.code,
          tier: member.tier,
          amount: Number(amount),
          month,
          paymentDate: formattedDate,
          method,
          targetRecordId: prefilledRecord?.id,
        });

        onClose();
      } else {
        setErrors((prev) => ({
          ...prev,
          general: res.error || "Failed to record payment.",
        }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: "An unexpected error occurred while saving payment.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      {errors.general && (
        <div className="rounded-xl border border-danger/25 bg-[#FDF2F2] p-3 text-xs text-danger flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>{errors.general}</p>
        </div>
      )}

      {/* 1. Member Selector */}
      <div className="space-y-1.5">
        <label
          htmlFor="payment-member-select"
          className="block text-xs font-semibold text-secondary-foreground"
        >
          Member <span className="text-danger">*</span>
        </label>
        <select
          id="payment-member-select"
          value={selectedMemberId}
          onChange={(e) => handleMemberChange(e.target.value)}
          disabled={isSubmitting}
          className={cn(
            "h-11 w-full rounded-xl border border-border bg-[#F5F8F6] px-3.5 text-sm text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors",
            errors.member && "border-danger focus:border-danger focus:ring-danger"
          )}
        >
          <option value="" disabled>
            Select a member...
          </option>
          {demoMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.code}) — {m.tier}
            </option>
          ))}
        </select>
        {errors.member && (
          <p className="text-xs font-medium text-danger flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.member}</span>
          </p>
        )}
      </div>

      {/* 2. Amount & Month in 2 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount */}
        <div className="space-y-1.5">
          <label
            htmlFor="payment-amount-input"
            className="block text-xs font-semibold text-secondary-foreground"
          >
            Amount (PKR) <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              Rs.
            </span>
            <input
              id="payment-amount-input"
              type="number"
              min="1"
              step="100"
              value={amount}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Number(e.target.value);
                setAmount(val);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
              placeholder="3000"
              disabled={isSubmitting}
              className={cn(
                "h-11 w-full rounded-xl border border-border bg-[#F5F8F6] pl-11 pr-3.5 text-sm font-semibold text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors",
                errors.amount && "border-danger focus:border-danger focus:ring-danger"
              )}
            />
          </div>
          {errors.amount && (
            <p className="text-xs font-medium text-danger flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.amount}</span>
            </p>
          )}
        </div>

        {/* Membership Month */}
        <div className="space-y-1.5">
          <label
            htmlFor="payment-month-select"
            className="block text-xs font-semibold text-secondary-foreground"
          >
            Membership Month <span className="text-danger">*</span>
          </label>
          <select
            id="payment-month-select"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              if (errors.month) setErrors((prev) => ({ ...prev, month: undefined }));
            }}
            disabled={isSubmitting}
            className={cn(
              "h-11 w-full rounded-xl border border-border bg-[#F5F8F6] px-3.5 text-sm text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors",
              errors.month && "border-danger focus:border-danger focus:ring-danger"
            )}
          >
            {availableMonths
              .filter((m) => m !== "All Months")
              .map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
          </select>
          {errors.month && (
            <p className="text-xs font-medium text-danger flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.month}</span>
            </p>
          )}
        </div>
      </div>

      {/* 3. Payment Date */}
      <div className="space-y-1.5">
        <label
          htmlFor="payment-date-input"
          className="block text-xs font-semibold text-secondary-foreground"
        >
          Payment Date <span className="text-danger">*</span>
        </label>
        <input
          id="payment-date-input"
          type="date"
          value={paymentDate}
          onChange={(e) => {
            setPaymentDate(e.target.value);
            if (errors.paymentDate)
              setErrors((prev) => ({ ...prev, paymentDate: undefined }));
          }}
          disabled={isSubmitting}
          className={cn(
            "h-11 w-full rounded-xl border border-border bg-[#F5F8F6] px-3.5 text-sm text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors",
            errors.paymentDate && "border-danger focus:border-danger focus:ring-danger"
          )}
        />
        {errors.paymentDate && (
          <p className="text-xs font-medium text-danger flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.paymentDate}</span>
          </p>
        )}
      </div>

      {/* 4. Payment Method */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-secondary-foreground">
          Payment Method <span className="text-danger">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {(
            [
              { label: "Cash", value: "Cash", icon: Banknote },
              { label: "Bank Transfer", value: "Bank Transfer", icon: Building2 },
              { label: "Other", value: "Other", icon: CreditCard },
            ] as const
          ).map((opt) => {
            const Icon = opt.icon;
            const isSelected = method === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setMethod(opt.value);
                  if (errors.method)
                    setErrors((prev) => ({ ...prev, method: undefined }));
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition-all cursor-pointer",
                  isSelected
                    ? "border-primary bg-accent text-primary shadow-xs"
                    : "border-border bg-[#F5F8F6] text-secondary-foreground hover:bg-card hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
        {errors.method && (
          <p className="text-xs font-medium text-danger flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.method}</span>
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="w-full sm:w-auto h-11 px-5 rounded-xl border border-border bg-card text-xs sm:text-sm font-semibold text-secondary-foreground hover:bg-[#F5F8F6] hover:text-foreground active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto h-11 px-6 rounded-xl bg-primary text-xs sm:text-sm font-semibold text-white hover:bg-primary-hover active:scale-[0.98] shadow-xs transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Payment...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4 stroke-[2.5]" />
              <span>Save Payment</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
