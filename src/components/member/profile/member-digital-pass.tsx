"use client";

import * as React from "react";
import { Dumbbell, QrCode, Sparkles, ShieldCheck } from "lucide-react";
import type { MemberInfo, MembershipDetails } from "@/types/member-dashboard";

interface MemberDigitalPassProps {
  member: MemberInfo;
  membership: MembershipDetails;
  gymName?: string;
  onOpenScanner?: () => void;
}

export function MemberDigitalPass({
  member,
  membership,
  gymName = "Downtown Flagship Club",
  onOpenScanner,
}: MemberDigitalPassProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121B17] via-[#1A2922] to-[#111A16] p-6 sm:p-7 text-white shadow-xl border border-[#2B3E35] transition-all hover:shadow-2xl">
      {/* Background Decorative Circles / Hologram-like aesthetic */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-[#00B386]/10 blur-2xl" />

      {/* Top Header: Brand & Active Pass Chip */}
      <div className="relative z-10 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md">
            <Dumbbell className="h-4 w-4 stroke-[2.4]" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block leading-none">
              FitFlow Pass
            </span>
            <span className="text-[10px] font-medium text-white/60 tracking-wider uppercase">
              {gymName}
            </span>
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/40 px-3 py-1 text-[11px] font-extrabold text-[#00E5AA] shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00E5AA] animate-pulse" />
          <span>{membership.status === "ACTIVE" ? "ACTIVE PASS" : membership.status}</span>
        </div>
      </div>

      {/* Center Details: Member Identity */}
      <div className="relative z-10 py-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-white/50 block">
            Member Name
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {member.name}
          </h2>
          <div className="inline-flex items-center gap-2 pt-0.5">
            <span className="font-mono text-xs text-[#00E5AA] font-bold tracking-widest bg-white/5 px-2.5 py-0.5 rounded-md border border-white/10">
              {member.memberCode}
            </span>
            <span className="text-white/40 text-xs">•</span>
            <span className="text-xs text-white/70 font-medium">
              Verified Athlete
            </span>
          </div>
        </div>

        {/* Turnstile Access QR Icon Chip */}
        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
          {onOpenScanner ? (
            <button
              id="digital-pass-gate-access-btn"
              type="button"
              onClick={onOpenScanner}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 text-xs font-bold text-white transition-all cursor-pointer shadow-xs active:scale-95"
              title="Open QR scanner for turnstile access"
            >
              <QrCode className="h-3.5 w-3.5 text-[#00E5AA]" />
              <span>Gate Access</span>
            </button>
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 border border-white/15 shadow-inner">
              <QrCode className="h-6 w-6 text-[#00E5AA] stroke-[1.8]" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer: Plan Tier & Renewal */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/10 pt-4 text-xs">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-white/50 block">
            Tier
          </span>
          <span className="font-bold text-white flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-warning" />
            {membership.planName}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-white/50 block">
            Valid Until
          </span>
          <span className="font-bold text-white">
            {membership.expiryDate}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center sm:justify-end">
          <div className="inline-flex items-center gap-1 text-[11px] text-[#A0B3A8]">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>RFID & Digital Linked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
