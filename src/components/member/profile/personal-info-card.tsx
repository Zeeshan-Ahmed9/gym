"use client";

import * as React from "react";
import { User, Phone, Mail, Hash, ShieldCheck, Edit3 } from "lucide-react";
import type { MemberInfo } from "@/types/member-dashboard";

interface PersonalInfoCardProps {
  member: MemberInfo;
  onEditClick: () => void;
}

export function PersonalInfoCard({ member, onEditClick }: PersonalInfoCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-5 hover:border-[#BAC8BF] transition-all">
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-primary shadow-2xs">
            <User className="h-4 w-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Personal Information
            </h3>
            <p className="text-xs text-[#718078] font-medium">
              Primary profile details and registered contact info
            </p>
          </div>
        </div>

        {/* Edit Action Button */}
        <button
          id="personal-info-edit-btn"
          type="button"
          onClick={onEditClick}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-2xs hover:bg-[#F5F8F6] hover:border-[#BAC8BF] transition-all cursor-pointer"
        >
          <Edit3 className="h-3.5 w-3.5 text-[#718078]" />
          <span>Edit</span>
        </button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Full Name */}
        <div className="rounded-2xl bg-[#F9FBFA] border border-border/70 p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-[#718078] flex items-center gap-1.5">
            <User className="h-3 w-3 text-[#718078]" /> Full Name
          </span>
          <p className="font-semibold text-sm text-foreground">
            {member.name}
          </p>
        </div>

        {/* Member Code */}
        <div className="rounded-2xl bg-[#F9FBFA] border border-border/70 p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-[#718078] flex items-center gap-1.5">
            <Hash className="h-3 w-3 text-[#718078]" /> Member ID
          </span>
          <p className="font-mono font-semibold text-sm text-primary">
            {member.memberCode}
          </p>
        </div>

        {/* Phone */}
        <div className="rounded-2xl bg-[#F9FBFA] border border-border/70 p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-[#718078] flex items-center gap-1.5">
            <Phone className="h-3 w-3 text-[#718078]" /> Phone Number
          </span>
          <p className="font-medium text-sm text-foreground">
            {member.phone || "Not provided"}
          </p>
        </div>

        {/* Email */}
        <div className="rounded-2xl bg-[#F9FBFA] border border-border/70 p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-[#718078] flex items-center gap-1.5">
            <Mail className="h-3 w-3 text-[#718078]" /> Email Address
          </span>
          <p className="font-medium text-sm text-foreground truncate">
            {member.email || "Not provided"}
          </p>
        </div>
      </div>

      {/* Verification Strip */}
      <div className="flex items-center justify-between rounded-2xl bg-accent/40 border border-primary/20 px-4 py-2.5 text-xs text-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="font-medium text-[#718078]">Account Verification:</span>
          <span className="font-semibold text-primary">Verified Active</span>
        </div>
        <span className="text-[11px] text-[#718078] font-medium hidden xs:inline">
          Turnstile Gate Enabled
        </span>
      </div>
    </div>
  );
}
