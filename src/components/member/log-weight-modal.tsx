"use client";

import * as React from "react";
import { X, Scale, Loader2, Check } from "lucide-react";
import { logWeightAction } from "@/server/actions/member-dashboard.actions";

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  currentWeight: number | null;
  onSuccess: (newWeight: number) => void;
}

export function LogWeightModal({
  isOpen,
  onClose,
  memberId,
  currentWeight,
  onSuccess,
}: LogWeightModalProps) {
  const [weight, setWeight] = React.useState<string>(
    currentWeight ? currentWeight.toString() : "72.0"
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && currentWeight) {
      setWeight(currentWeight.toString());
      setError(null);
    }
  }, [isOpen, currentWeight]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weight);
    if (isNaN(val) || val <= 20 || val > 300) {
      setError("Please enter a valid weight measurement (20-300 kg).");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await logWeightAction(memberId, val);
      if (res.success) {
        onSuccess(val);
        onClose();
      } else {
        setError(res.error || "Failed to save weight.");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-[#17221D]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-border bg-card p-6 text-foreground shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full border border-border bg-card p-1.5 text-[#718078] hover:bg-[#F5F8F6] hover:text-foreground cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
          <Scale className="h-4 w-4" />
          <span>Body Metrics</span>
        </div>
        <h3 className="text-lg font-extrabold text-[#14211D]">Log Body Weight</h3>
        <p className="text-xs text-[#718078] mt-0.5">
          Record today&apos;s measurement in kg to track your progress trend.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#14211D] mb-1.5">
              Weight (kg)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="20"
                max="300"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-xl border border-border bg-[#F5F8F6] px-4 py-2.5 text-base font-bold text-[#14211D] focus:border-primary focus:bg-white focus:outline-hidden transition-all"
                placeholder="72.0"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#718078]">
                kg
              </span>
            </div>
          </div>

          {error && (
            <p className="text-xs text-danger font-medium">{error}</p>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-[#718078] hover:bg-[#F5F8F6] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  <span>Save Entry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
