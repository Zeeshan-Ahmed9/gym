"use client";

import * as React from "react";
import { X, Edit2, AlertCircle, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateMemberAction } from "@/server/actions/member.actions";

export interface EditMemberData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  monthlyFee?: number;
  rawExpiryDate?: string;
  membershipStatus?: "ACTIVE" | "EXPIRED";
}

export interface EditMemberModalProps {
  member: EditMemberData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface EditMemberFormProps {
  member: EditMemberData;
  onClose: () => void;
  onSuccess?: () => void;
}

function EditMemberForm({ member, onClose, onSuccess }: EditMemberFormProps) {
  const [name, setName] = React.useState(member.name || "");
  const [phone, setPhone] = React.useState(member.phone === "—" ? "" : member.phone || "");
  const [email, setEmail] = React.useState(member.email === "—" ? "" : member.email || "");
  const [monthlyFee, setMonthlyFee] = React.useState<number | "">(member.monthlyFee ?? 3000);
  const [expiryDate, setExpiryDate] = React.useState(member.rawExpiryDate || "");
  const [status, setStatus] = React.useState<"ACTIVE" | "EXPIRED">(
    member.membershipStatus || "ACTIVE"
  );

  const [errors, setErrors] = React.useState<{
    name?: string;
    phone?: string;
    email?: string;
    monthlyFee?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validate = (): boolean => {
    const errs: typeof errors = {};

    if (!name.trim()) errs.name = "Name cannot be empty.";
    if (!phone.trim()) errs.phone = "Phone cannot be empty.";

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errs.email = "Please enter a valid email address.";
      }
    }

    if (monthlyFee !== "" && Number(monthlyFee) <= 0) {
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
      const res = await updateMemberAction({
        id: member.id,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        monthlyFee: monthlyFee === "" ? undefined : Number(monthlyFee),
        expiryDate: expiryDate || undefined,
        status,
      });

      if (res.success) {
        onSuccess?.();
        onClose();
      } else {
        setErrors((prev) => ({
          ...prev,
          general: res.error || "Failed to update member.",
        }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: "An unexpected error occurred while saving changes.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {errors.general && (
        <div className="rounded-xl border border-danger/25 bg-[#FDF2F2] p-3 text-xs text-danger flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>{errors.general}</p>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-secondary-foreground">
          Full Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          disabled={isSubmitting}
          className={cn(
            "h-11 w-full rounded-xl border border-border bg-[#F5F8F6] px-3.5 text-sm text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors",
            errors.name && "border-danger focus:border-danger focus:ring-danger"
          )}
        />
        {errors.name && <p className="text-xs text-danger font-medium">{errors.name}</p>}
      </div>

      {/* Phone & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-secondary-foreground">
            Phone Number <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
            }}
            disabled={isSubmitting}
            className={cn(
              "h-11 w-full rounded-xl border border-border bg-[#F5F8F6] px-3.5 text-sm text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors",
              errors.phone && "border-danger focus:border-danger focus:ring-danger"
            )}
          />
          {errors.phone && <p className="text-xs text-danger font-medium">{errors.phone}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-secondary-foreground">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            disabled={isSubmitting}
            placeholder="Optional"
            className={cn(
              "h-11 w-full rounded-xl border border-border bg-[#F5F8F6] px-3.5 text-sm text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors",
              errors.email && "border-danger focus:border-danger focus:ring-danger"
            )}
          />
          {errors.email && <p className="text-xs text-danger font-medium">{errors.email}</p>}
        </div>
      </div>

      {/* Monthly Fee & Expiry Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-secondary-foreground">
            Monthly Fee (PKR)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
              Rs.
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={monthlyFee}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Number(e.target.value);
                setMonthlyFee(val);
                if (errors.monthlyFee)
                  setErrors((prev) => ({ ...prev, monthlyFee: undefined }));
              }}
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-border bg-[#F5F8F6] pl-9 pr-3 text-sm font-semibold text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-secondary-foreground">
            Expiry Date
          </label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl border border-border bg-[#F5F8F6] px-3.5 text-sm text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
      </div>

      {/* Membership Status Selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-secondary-foreground">
          Membership Status
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStatus("ACTIVE")}
            className={cn(
              "h-10 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
              status === "ACTIVE"
                ? "border-success/30 bg-[#E5F6EF] text-success shadow-xs"
                : "border-border bg-[#F5F8F6] text-muted-foreground hover:bg-card hover:text-foreground"
            )}
          >
            <span className="h-2 w-2 rounded-full bg-success" />
            <span>Active</span>
          </button>
          <button
            type="button"
            onClick={() => setStatus("EXPIRED")}
            className={cn(
              "h-10 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
              status === "EXPIRED"
                ? "border-danger/30 bg-[#FDF2F2] text-danger shadow-xs"
                : "border-border bg-[#F5F8F6] text-muted-foreground hover:bg-card hover:text-foreground"
            )}
          >
            <span className="h-2 w-2 rounded-full bg-danger" />
            <span>Expired</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="h-10 px-4 rounded-xl border border-border bg-card text-xs font-semibold text-secondary-foreground hover:bg-[#F5F8F6] hover:text-foreground transition-all cursor-pointer disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-5 rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export function EditMemberModal({
  member,
  isOpen,
  onClose,
  onSuccess,
}: EditMemberModalProps) {
  // Handle body overflow
  React.useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Escape
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

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
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card text-foreground shadow-2xl transition-all font-sans my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pale-mint border border-primary/20 text-primary">
              <Edit2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Edit Member Details
              </h2>
              <p className="text-xs text-muted-foreground">
                Update personal info and membership settings.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-card p-1.5 text-muted-foreground hover:bg-[#F5F8F6] hover:text-foreground transition-all cursor-pointer disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Inner Form with key ensuring fresh state per member */}
        <EditMemberForm
          key={member.id}
          member={member}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}
