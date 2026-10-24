"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Scale, Plus, Check, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { logWeightAction } from "@/server/actions/member-dashboard.actions";

interface ProgressItem {
  id: string;
  date: string;
  weight: number | null;
  chest: number | null;
  waist: number | null;
  arms: number | null;
}

interface ProgressViewProps {
  memberId: string;
  memberName: string;
  initialRecords: ProgressItem[];
}

export function ProgressView({
  memberId,
  memberName,
  initialRecords,
}: ProgressViewProps) {
  const [records, setRecords] = React.useState<ProgressItem[]>(initialRecords);
  const [isLogging, setIsLogging] = React.useState(false);
  const [weightInput, setWeightInput] = React.useState("72.0");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (isNaN(val) || val <= 20 || val > 300) {
      setError("Please enter a valid weight (20-300 kg).");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await logWeightAction(memberId, val);
      if (res.success) {
        setRecords((prev) => [
          {
            id: `temp-${Date.now()}`,
            date: format(new Date(), "dd MMM yyyy"),
            weight: val,
            chest: null,
            waist: null,
            arms: null,
          },
          ...prev,
        ]);
        setIsLogging(false);
      } else {
        setError(res.error || "Failed to save measurement.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const latestWeight = records[0]?.weight ?? 72.0;
  const startingWeight = records[records.length - 1]?.weight ?? latestWeight;
  const change = latestWeight - startingWeight;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/member"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-2 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Body Metrics & Progress
          </h1>
          <p className="text-sm text-[#718078] font-medium mt-0.5">
            Physical measurement history and weight tracking for {memberName}.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsLogging(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Log Measurement</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#718078] block mb-1">
            Current Weight
          </span>
          <span className="text-3xl font-bold text-foreground">
            {latestWeight.toFixed(1)} <span className="text-sm font-medium text-[#718078]">kg</span>
          </span>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#718078] block mb-1">
            Starting Weight
          </span>
          <span className="text-3xl font-bold text-foreground">
            {startingWeight.toFixed(1)} <span className="text-sm font-medium text-[#718078]">kg</span>
          </span>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#718078] block mb-1">
            Total Net Change
          </span>
          <span className="text-3xl font-bold text-foreground inline-flex items-center gap-2">
            {change > 0 ? `+${change.toFixed(1)}` : `${change.toFixed(1)}`}
            <span className="text-xs font-semibold rounded-md bg-accent px-2 py-0.5 text-success">
              kg
            </span>
          </span>
        </div>
      </div>

      {/* Log Form Dialog */}
      {isLogging && (
        <div className="rounded-3xl border border-primary/30 bg-card p-6 shadow-md animate-in slide-in-from-top-3 duration-200">
          <h3 className="text-base font-semibold text-foreground mb-1">
            Record New Measurement
          </h3>
          <p className="text-xs text-[#718078] mb-4">
            Enter your current weight to update your progress trend line.
          </p>

          <form onSubmit={handleAddMeasurement} className="flex flex-col sm:flex-row items-end gap-3 max-w-md">
            <div className="w-full sm:w-48">
              <label className="block text-xs font-bold text-[#14211D] mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="300"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-full rounded-xl border border-border bg-[#F5F8F6] px-3.5 py-2 text-sm font-bold text-[#14211D] focus:bg-white focus:border-primary focus:outline-hidden"
                placeholder="72.0"
                autoFocus
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsLogging(false)}
                className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-[#718078] hover:bg-[#F5F8F6]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover shadow-xs cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && <p className="text-xs text-danger font-medium mt-2">{error}</p>}
        </div>
      )}

      {/* Measurement History Table */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
        {records.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Scale className="h-8 w-8 text-[#718078] mx-auto" />
            <p className="text-sm font-bold text-[#14211D]">No Progress Measurements Yet</p>
            <p className="text-xs text-[#718078]">
              Log your first body weight entry to start visualizing your fitness transformation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-[#F5F8F6] text-xs font-bold text-[#718078]">
                <tr>
                  <th className="py-3.5 pl-6 pr-4">Date Recorded</th>
                  <th className="py-3.5 px-4">Weight (kg)</th>
                  <th className="py-3.5 px-4">Chest</th>
                  <th className="py-3.5 px-4">Waist</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">Arms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F5F8F6]/50 transition-colors">
                    <td className="py-3.5 pl-6 pr-4 font-bold text-[#14211D]">
                      {r.date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#14211D]">
                      {r.weight ? `${r.weight.toFixed(1)} kg` : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-[#718078]">
                      {r.chest ? `${r.chest} cm` : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-[#718078]">
                      {r.waist ? `${r.waist} cm` : "—"}
                    </td>
                    <td className="py-3.5 pl-4 pr-6 text-right text-[#718078]">
                      {r.arms ? `${r.arms} cm` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
