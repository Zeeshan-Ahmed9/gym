"use client";

import * as React from "react";
import {
  CreditCard,
  Clock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import type { GymSettings, GymSettingsFormErrors } from "@/types/settings";

interface MembershipDefaultsCardProps {
  settings: GymSettings;
  errors: GymSettingsFormErrors;
  onChange: <K extends keyof GymSettings>(field: K, value: GymSettings[K]) => void;
}

const DURATION_PRESETS = [1, 3, 6, 12];

export function MembershipDefaultsCard({
  settings,
  errors,
  onChange,
}: MembershipDefaultsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
      {/* Card Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Membership Defaults
          </h2>
          <p className="mt-0.5 text-sm text-secondary-foreground">
            Standard fee and duration applied when registering new gym members.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Defaults Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 1. Default Monthly Fee (PKR) */}
          <div className="space-y-1.5">
            <label
              htmlFor="default-monthly-fee-input"
              className="block text-xs font-semibold text-secondary-foreground"
            >
              Default Monthly Fee (PKR) <span className="text-danger">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 flex items-center font-medium text-xs text-muted-foreground">
                Rs.
              </div>
              <input
                id="default-monthly-fee-input"
                type="number"
                min="0"
                step="any"
                value={settings.defaultMonthlyFee === 0 ? "" : settings.defaultMonthlyFee}
                onChange={(e) => {
                  const val = e.target.value === "" ? 0 : Number(e.target.value);
                  onChange("defaultMonthlyFee", isNaN(val) ? 0 : val);
                }}
                placeholder="3000"
                className={`flex h-11 w-full rounded-xl border bg-[#F5F8F6] pl-10 pr-3.5 py-2 text-sm font-semibold text-foreground placeholder:text-muted-foreground/60 transition-colors focus:bg-card focus:outline-none focus:ring-1 ${
                  errors.defaultMonthlyFee
                    ? "border-danger focus:border-danger focus:ring-danger"
                    : "border-border focus:border-primary focus:ring-primary"
                }`}
              />
            </div>
            {errors.defaultMonthlyFee ? (
              <p className="flex items-center gap-1 text-xs font-medium text-danger mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.defaultMonthlyFee}</span>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Suggested fee for new member registrations.
              </p>
            )}
          </div>

          {/* 2. Default Membership Duration */}
          <div className="space-y-1.5">
            <label
              htmlFor="default-duration-input"
              className="block text-xs font-semibold text-secondary-foreground"
            >
              Default Duration (Months) <span className="text-danger">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                id="default-duration-input"
                type="number"
                min="1"
                step="1"
                value={
                  settings.defaultMembershipDurationMonths === 0
                    ? ""
                    : settings.defaultMembershipDurationMonths
                }
                onChange={(e) => {
                  const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                  onChange(
                    "defaultMembershipDurationMonths",
                    isNaN(val) ? 0 : val
                  );
                }}
                placeholder="1"
                className={`flex h-11 w-full rounded-xl border bg-[#F5F8F6] px-3.5 pr-20 py-2 text-sm font-semibold text-foreground placeholder:text-muted-foreground/60 transition-colors focus:bg-card focus:outline-none focus:ring-1 ${
                  errors.defaultMembershipDurationMonths
                    ? "border-danger focus:border-danger focus:ring-danger"
                    : "border-border focus:border-primary focus:ring-primary"
                }`}
              />
              <div className="pointer-events-none absolute right-3.5 flex items-center text-xs font-medium text-muted-foreground">
                Month{settings.defaultMembershipDurationMonths > 1 ? "s" : ""}
              </div>
            </div>

            {/* Quick preset chips */}
            <div className="flex items-center gap-1.5 pt-1">
              {DURATION_PRESETS.map((months) => {
                const isSelected =
                  settings.defaultMembershipDurationMonths === months;
                return (
                  <button
                    key={months}
                    type="button"
                    onClick={() =>
                      onChange("defaultMembershipDurationMonths", months)
                    }
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white shadow-xs"
                        : "bg-[#F5F8F6] border border-border text-secondary-foreground hover:bg-card"
                    }`}
                  >
                    {months}M
                  </button>
                );
              })}
            </div>

            {errors.defaultMembershipDurationMonths && (
              <p className="flex items-center gap-1 text-xs font-medium text-danger mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.defaultMembershipDurationMonths}</span>
              </p>
            )}
          </div>
        </div>

        {/* 3. Membership Expiry Behavior Note */}
        <div className="rounded-xl border border-border bg-[#F5F8F6] p-4 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <Clock className="h-4 w-4 text-warning shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-foreground">
                Membership Expiry Policy
              </h4>
              <p className="text-xs text-secondary-foreground leading-relaxed">
                Memberships reaching their end date are marked as Expired and do not automatically charge or renew without front-desk verification.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>
              Adjusting default fees or durations affects future registrations only.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
