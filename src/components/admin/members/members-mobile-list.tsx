import * as React from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Clock, Eye, Edit2, Calendar, Phone, DollarSign } from "lucide-react";
import type { MemberListItem } from "@/types/member";

interface MembersMobileListProps {
  members: MemberListItem[];
}

export function MembersMobileList({ members }: MembersMobileListProps) {
  return (
    <div className="flex flex-col gap-3 md:hidden">
      {members.map((member) => (
        <div
          key={member.id}
          className="rounded-2xl border border-border bg-[#15191D] p-4 shadow-sm space-y-3.5"
        >
          {/* Header Row: Initials, Name, Code, and Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary border border-border text-xs font-extrabold text-foreground shadow-inner">
                {member.initials}
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm leading-tight">
                  {member.name}
                </h4>
                <span className="font-mono text-xs font-semibold text-muted-foreground mt-0.5 inline-block">
                  {member.memberCode}
                </span>
              </div>
            </div>

            {/* Membership Status Badge */}
            {member.membershipStatus === "ACTIVE" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 border border-success/30 px-2.5 py-0.5 text-[11px] font-bold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/15 border border-danger/30 px-2.5 py-0.5 text-[11px] font-bold text-danger">
                <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                Expired
              </span>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-card/40 p-3 text-xs border border-border/40">
            {/* Phone */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Phone className="h-2.5 w-2.5" />
                Phone
              </span>
              <p className="font-semibold text-foreground text-[11px] truncate">
                {member.phone}
              </p>
            </div>

            {/* Expiry */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" />
                Expiry Date
              </span>
              <p className="font-semibold text-foreground text-[11px]">
                {member.expiryDate}
              </p>
              {member.isExpiringSoon && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-warning">
                  <Clock className="h-2 w-2" />
                  Expiring soon
                </span>
              )}
            </div>

            {/* Fee & Fee Status */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-2.5 w-2.5" />
                Monthly Fee
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-foreground text-[11px]">
                  {member.monthlyFee}
                </span>
                {member.feeStatus === "PAID" ? (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-success/15 border border-success/30 px-1.5 py-0.2 text-[9px] font-bold text-success">
                    <CheckCircle2 className="h-2 w-2" />
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-warning/15 border border-warning/30 px-1.5 py-0.2 text-[9px] font-bold text-warning">
                    <AlertCircle className="h-2 w-2" />
                    Due
                  </span>
                )}
              </div>
            </div>

            {/* Last Check-in */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Last Check-in
              </span>
              <p className="font-medium text-muted-foreground text-[11px]">
                {member.lastCheckIn}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-0.5">
            <Link
              href={`/admin/members/${member.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2 text-xs font-bold text-foreground hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View Profile</span>
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={`Edit ${member.name}`}
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
