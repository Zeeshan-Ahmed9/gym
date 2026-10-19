"use client";

import * as React from "react";
import { X, UserPlus, AlertCircle, Calendar, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createMemberAction } from "@/server/actions/member.actions";
import { addMonths, format, isValid, parseISO } from "date-fns";

export interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: { id: string; memberCode: string; name: string }) => void;
  defaultMonthlyFee?: number;
  defaultDurationMonths?: number;
}

export function AddMemberModal({
  isOpen,
  onClose,
  onSuccess,
  defaultMonthlyFee = 3000,
  defaultDurationMonths = 1,
}: AddMemberModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-member-title"
    >
      {/* Dimmed & Blurred Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-[#17221D]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Centered Modal Surface */}
      <div
        className={cn(
          "relative z-10 w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-border bg-card text-foreground shadow-2xl transition-all font-sans my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        )}
      >
        <AddMemberForm
          onClose={onClose}
          onSuccess={onSuccess}
          defaultMonthlyFee={defaultMonthlyFee}
          defaultDurationMonths={defaultDurationMonths}
        />
      </div>
    </div>
  );
}

function AddMemberForm({
  onClose,
  onSuccess,
  defaultMonthlyFee,
  defaultDurationMonths,
}: {
  onClose: () => void;
  onSuccess?: (created: { id: string; memberCode: string; name: string }) => void;
  defaultMonthlyFee: number;
  defaultDurationMonths: number;
}) {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [startDate, setStartDate] = React.useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [durationMonths, setDurationMonths] = React.useState<number | "">(
    defaultDurationMonths
  );
  const [expiryDate, setExpiryDate] = React.useState(() => {
    return addMonths(new Date(), defaultDurationMonths).toISOString().split("T")[0];
  });
  const [isExpiryOverridden, setIsExpiryOverridden] = React.useState(false);
  const [monthlyFee, setMonthlyFee] = React.useState<number | "">(defaultMonthlyFee);

  const [errors, setErrors] = React.useState<{
    name?: string;
    phone?: string;
    email?: string;
    startDate?: string;
    durationMonths?: string;
    expiryDate?: string;
    monthlyFee?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const firstInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: undefined }));

    if (!isExpiryOverridden && durationMonths && Number(durationMonths) > 0) {
      try {
        const parsed = parseISO(val);
        if (isValid(parsed)) {
          setExpiryDate(addMonths(parsed, Number(durationMonths)).toISOString().split("T")[0]);
        }
      } catch {
        // ignore
      }
    }
  };

  const handleDurationChange = (val: number | "") => {
    setDurationMonths(val);
    if (errors.durationMonths) setErrors((prev) => ({ ...prev, durationMonths: undefined }));

    if (!isExpiryOverridden && val && Number(val) > 0 && startDate) {
      try {
        const parsed = parseISO(startDate);
        if (isValid(parsed)) {
          setExpiryDate(addMonths(parsed, Number(val)).toISOString().split("T")[0]);
        }
      } catch {
        // ignore
      }
    }
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};

    if (!name.trim()) {
      errs.name = "Name cannot be empty.";
    }

    if (!phone.trim()) {
      errs.phone = "Phone cannot be empty.";
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errs.email = "Please enter a valid email address.";
      }
    }

    if (!startDate) {
      errs.startDate = "Start date is required.";
    }

    const dur = Number(durationMonths);
    if (!durationMonths || isNaN(dur) || dur <= 0 || !Number.isInteger(dur)) {
      errs.durationMonths = "Duration must be a positive whole number.";
    }

    if (!expiryDate) {
      errs.expiryDate = "Expiry date is required.";
    } else if (startDate && new Date(expiryDate) <= new Date(startDate)) {
      errs.expiryDate = "Expiry must be after the start date.";
    }

    const fee = Number(monthlyFee);
    if (monthlyFee === "" || isNaN(fee) || fee <= 0) {
      errs.monthlyFee = "Monthly fee must be greater than zero.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await createMemberAction({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        startDate,
        durationMonths: Number(durationMonths),
        expiryDate,
        monthlyFee: Number(monthlyFee),
      });

      if (res.success && res.data) {
        onSuccess?.(res.data);
        onClose();
      } else {
        setErrors((prev) => ({
          ...prev,
          general: res.error || "Failed to create member. Please try again.",
        }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: "An unexpected error occurred while creating member.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  let formattedExpiryPreview = expiryDate;
  try {
    const d = parseISO(expiryDate);
    if (isValid(d)) {
      formattedExpiryPreview = format(d, "dd MMMM yyyy");
    }
  } catch {
    formattedExpiryPreview = expiryDate;
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pale-mint border border-primary/20 text-primary shadow-xs">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="add-member-title"
              className="text-lg sm:text-xl font-bold tracking-tight text-foreground"
            >
              Add New Member
            </h2>
            <p className="text-xs sm:text-sm text-secondary-foreground">
              Create a gym member profile and set up their membership.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-xl border border-border bg-card p-1.5 text-muted-foreground hover:bg-[#F5F8F6] hover:text-foreground transition-all cursor-pointer disabled:opacity-40"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable Form Body */}
      <form
        id="add-member-form"
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-6 space-y-6"
      >
        {errors.general && (
          <div className="rounded-xl border border-danger/25 bg-[#FDF2F2] p-3.5 text-xs text-danger flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Creation Failed</p>
              <p className="text-danger/90">{errors.general}</p>
            </div>
          </div>
        )}

        {/* SECTION 1: Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pale-mint text-[11px] font-bold text-primary">
              1
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2 space-y-1.5">
              <label
                htmlFor="member-name-input"
                className="block text-xs font-semibold text-secondary-foreground"
              >
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                id="member-name-input"
                ref={firstInputRef}
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="e.g. Tariq Mehmood"
                disabled={isSubmitting}
                className={cn(
                  "h-11 w-full rounded-xl border border-border bg-[#F5F8F6] px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors",
                  errors.name && "border-danger focus:border-danger focus:ring-danger"
                )}
              />
              {errors.name && (
                <p className="text-xs font-medium text-danger flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label
                htmlFor="member-phone-input"
                className="block text-xs font-semibold text-secondary-foreground"
              >
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                id="member-phone-input"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder="e.g. +92 300 1234567"
                disabled={isSubmitting}
                className={cn(
                  "h-11 w-full rounded-xl border border-border bg-[#F5F8F6] px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors",
                  errors.phone && "border-danger focus:border-danger focus:ring-danger"
                )}
              />
              {errors.phone && (
                <p className="text-xs font-medium text-danger flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="member-email-input"
                className="block text-xs font-semibold text-secondary-foreground"
              >
                Email Address <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <input
                id="member-email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="e.g. tariq@gmail.com"
                disabled={isSubmitting}
                className={cn(
                  "h-11 w-full rounded-xl border border-border bg-[#F5F8F6] px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors",
                  errors.email && "border-danger focus:border-danger focus:ring-danger"
                )}
              />
              {errors.email && (
                <p className="text-xs font-medium text-danger flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border/80" />

        {/* SECTION 2: Membership Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pale-mint text-[11px] font-bold text-primary">
              2
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Membership Setup
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-1.5">
              <label
                htmlFor="member-start-date"
                className="block text-xs font-semibold text-secondary-foreground"
              >
                Membership Start Date <span className="text-danger">*</span>
              </label>
              <input
                id="member-start-date"
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                disabled={isSubmitting}
                className={cn(
                  "h-11 w-full rounded-xl border border-border bg-[#F5F8F6] px-3.5 text-sm text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors",
                  errors.startDate && "border-danger focus:border-danger focus:ring-danger"
                )}
              />
              {errors.startDate && (
                <p className="text-xs font-medium text-danger flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.startDate}</span>
                </p>
              )}
            </div>

            {/* Duration (Months) */}
            <div className="space-y-1.5">
              <label
                htmlFor="member-duration-input"
                className="block text-xs font-semibold text-secondary-foreground"
              >
                Duration (Months) <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <input
                  id="member-duration-input"
                  type="number"
                  min="1"
                  max="36"
                  value={durationMonths}
                  onChange={(e) => {
                    const val = e.target.value === "" ? "" : Number(e.target.value);
                    handleDurationChange(val);
                  }}
                  placeholder="1"
                  disabled={isSubmitting}
                  className={cn(
                    "h-11 w-full rounded-xl border border-border bg-[#F5F8F6] px-3.5 pr-14 text-sm font-semibold text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors",
                    errors.durationMonths &&
                      "border-danger focus:border-danger focus:ring-danger"
                  )}
                />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  months
                </span>
              </div>
              {errors.durationMonths && (
                <p className="text-xs font-medium text-danger flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.durationMonths}</span>
                </p>
              )}
            </div>

            {/* Expiry Date (calculated & adjustable) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="member-expiry-date"
                  className="block text-xs font-semibold text-secondary-foreground"
                >
                  Membership Expiry Date <span className="text-danger">*</span>
                </label>
                {isExpiryOverridden && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpiryOverridden(false);
                      if (startDate && durationMonths) {
                        const calculated = addMonths(parseISO(startDate), Number(durationMonths));
                        setExpiryDate(calculated.toISOString().split("T")[0]);
                      }
                    }}
                    className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Reset to auto
                  </button>
                )}
              </div>
              <input
                id="member-expiry-date"
                type="date"
                value={expiryDate}
                onChange={(e) => {
                  setExpiryDate(e.target.value);
                  setIsExpiryOverridden(true);
                  if (errors.expiryDate)
                    setErrors((prev) => ({ ...prev, expiryDate: undefined }));
                }}
                disabled={isSubmitting}
                className={cn(
                  "h-11 w-full rounded-xl border border-border bg-[#F5F8F6] px-3.5 text-sm text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors",
                  errors.expiryDate && "border-danger focus:border-danger focus:ring-danger"
                )}
              />
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3 text-primary" />
                <span>Calculated expiry: <strong>{formattedExpiryPreview}</strong></span>
              </p>
              {errors.expiryDate && (
                <p className="text-xs font-medium text-danger flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.expiryDate}</span>
                </p>
              )}
            </div>

            {/* Monthly Fee (PKR) */}
            <div className="space-y-1.5">
              <label
                htmlFor="member-fee-input"
                className="block text-xs font-semibold text-secondary-foreground"
              >
                Monthly Fee (PKR) <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  Rs.
                </span>
                <input
                  id="member-fee-input"
                  type="number"
                  min="1"
                  step="100"
                  value={monthlyFee}
                  onChange={(e) => {
                    const val = e.target.value === "" ? "" : Number(e.target.value);
                    setMonthlyFee(val);
                    if (errors.monthlyFee)
                      setErrors((prev) => ({ ...prev, monthlyFee: undefined }));
                  }}
                  placeholder="3000"
                  disabled={isSubmitting}
                  className={cn(
                    "h-11 w-full rounded-xl border border-border bg-[#F5F8F6] pl-10 pr-3.5 text-sm font-semibold text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors",
                    errors.monthlyFee &&
                      "border-danger focus:border-danger focus:ring-danger"
                  )}
                />
              </div>
              {errors.monthlyFee && (
                <p className="text-xs font-medium text-danger flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.monthlyFee}</span>
                </p>
              )}
            </div>
          </div>

          {/* Initial Fee Status Info Note */}
          <div className="rounded-xl border border-border bg-[#F5F8F6] p-3 text-xs text-secondary-foreground flex items-center justify-between">
            <div>
              <span className="font-semibold text-foreground">Initial Fee Status:</span>
              <span className="ml-1 text-muted-foreground">
                Unpaid (marked as Due until payment is recorded)
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-warning/25 bg-[#FEF7EC] px-2 py-0.5 font-semibold text-warning text-xs">
              Due
            </span>
          </div>
        </div>
      </form>

      {/* Footer Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 px-6 py-4 border-t border-border bg-card">
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
          form="add-member-form"
          disabled={isSubmitting}
          className="w-full sm:w-auto h-11 px-6 rounded-xl bg-primary text-xs sm:text-sm font-semibold text-white hover:bg-primary-hover active:scale-[0.98] shadow-xs transition-all cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating Member...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4 stroke-[2.5]" />
              <span>Create Member</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
