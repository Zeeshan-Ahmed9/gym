"use client";

import * as React from "react";
import { CreditCard, Calendar, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import type { MembershipDetails } from "@/types/member-dashboard";

interface MembershipStatusCardProps {
  membership: MembershipDetails;
}

export function MembershipStatusCard({ membership }: MembershipStatusCardProps) {
  const isPaid = membership.feeStatus === "PAID";

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-5 hover:border-[#BAC8BF] transition-all">
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-primary shadow-2xs">
            <CreditCard className="h-4 w-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Membership Subscription
            </h3>
            <p className="text-xs text-[#718078] font-medium">
              Current gym plan and billing cycle
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
            membership.status === "ACTIVE"
              ? "bg-accent text-success border border-success/20"
              : "bg-[#FDF2F2] text-danger border border-danger/20"
          }`}
        >
          {membership.status}
        </span>
      </div>

      {/* Plan & Pricing */}
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#718078] block">
            Plan Tier
          </span>
          <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {membership.planName}
          </h4>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#718078] block">
            Monthly Dues
          </span>
          <p className="text-xl sm:text-2xl font-bold text-primary">
            Rs. {membership.monthlyFee.toLocaleString()}{" "}
            <span className="text-xs font-medium text-[#718078]">
              {membership.billingPeriod}
            </span>
          </p>
        </div>
      </div>

      {/* Expiry & Billing Information */}
      <div className="rounded-2xl bg-[#F9FBFA] border border-border/70 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#718078]">
            <Calendar className="h-3.5 w-3.5" />
            <span>Valid Until</span>
          </div>
          <span className="font-semibold text-foreground">
            {membership.expiryDate}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#718078]">
            <Clock className="h-3.5 w-3.5" />
            <span>Payment Status</span>
          </div>
          <span
            className={`font-semibold inline-flex items-center gap-1 ${
              isPaid ? "text-success" : "text-warning"
            }`}
          >
            {isPaid ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Paid for this month</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Due: Rs. {membership.duesAmount}</span>
              </>
            )}
          </span>
        </div>

        {/* Progress bar showing cycle status */}
        <div className="pt-1 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-[#718078] font-medium">
            <span>Cycle Status</span>
            <span className="text-primary font-semibold">Active & Good Standing</span>
          </div>
          <div className="w-full bg-[#E3EAE5] rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
