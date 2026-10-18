"use client";

import * as React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Dumbbell,
  CheckCircle2,
} from "lucide-react";
import type { GymSettings } from "@/types/settings";

interface SettingsPreviewCardProps {
  settings: GymSettings;
}

export function SettingsPreviewCard({ settings }: SettingsPreviewCardProps) {
  const formattedFee = React.useMemo(() => {
    const fee = Number(settings.defaultMonthlyFee);
    return isNaN(fee) ? "0" : fee.toLocaleString();
  }, [settings.defaultMonthlyFee]);

  const durationText = React.useMemo(() => {
    const months = Number(settings.defaultMembershipDurationMonths);
    if (!months || isNaN(months) || months <= 0) return "1 Month";
    return `${months} Month${months > 1 ? "s" : ""}`;
  }, [settings.defaultMembershipDurationMonths]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-primary">
          Preview
        </span>
        <span className="text-xs text-muted-foreground font-medium">
          Live Updates
        </span>
      </div>

      <div>
        <h3 className="text-base font-bold tracking-tight text-foreground">
          Brand & Pass Preview
        </h3>
        <p className="text-xs text-secondary-foreground mt-0.5">
          How your gym brand and pass appear across receipts and cards.
        </p>
      </div>

      {/* Clean Preview Card */}
      <div className="rounded-xl border border-border bg-[#F5F8F6] p-4 space-y-3.5">
        {/* Logo and Gym Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card border border-border text-primary overflow-hidden p-1 shadow-xs">
            {settings.gymLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.gymLogo}
                alt="Gym Logo"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <Dumbbell className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-foreground truncate">
              {settings.gymName.trim() || "Your Gym Name"}
            </h4>
            <p className="text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span>{settings.address.trim() || "Address not specified"}</span>
            </p>
          </div>
        </div>

        {/* Contact details */}
        <div className="pt-2.5 border-t border-border flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary-foreground">
          {settings.phone ? (
            <div className="flex items-center gap-1.5 font-medium">
              <Phone className="h-3 w-3 text-primary shrink-0" />
              <span>{settings.phone}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-muted-foreground italic">
              <Phone className="h-3 w-3 shrink-0" />
              <span>No phone entered</span>
            </div>
          )}

          {settings.email ? (
            <div className="flex items-center gap-1.5 text-secondary-foreground font-medium">
              <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
              <span>{settings.email}</span>
            </div>
          ) : null}
        </div>

        {/* Pass defaults row */}
        <div className="pt-2.5 border-t border-border flex items-center justify-between gap-2">
          <div className="rounded-lg bg-card border border-border px-2.5 py-1 text-xs font-semibold text-foreground shadow-xs">
            {durationText} Pass
          </div>
          <div className="rounded-lg bg-accent px-2.5 py-1 text-xs font-semibold text-primary">
            Rs. {formattedFee} / mo
          </div>
        </div>
      </div>

      {/* Helper text */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
        <span>Updates automatically as you edit settings.</span>
      </div>
    </div>
  );
}
