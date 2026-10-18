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
          className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3.5"
        >
          {/* Header Row: Initials, Name, Code, and Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pale-mint border border-primary/20 text-xs font-bold text-primary">
                {member.initials}
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm leading-tight">
                  {member.name}
                </h4>
                <span className="font-mono text-xs font-medium text-muted-foreground mt-0.5 inline-block">
                  {member.memberCode}
                </span>
              </div>
            </div>

            {/* Membership Status Badge */}
            {member.membershipStatus === "ACTIVE" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E5F6EF] border border-success/25 px-2.5 py-0.5 text-xs font-semibold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDF2F2] border border-danger/25 px-2.5 py-0.5 text-xs font-semibold text-danger">
                <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                Expired
              </span>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-[#F5F8F6] p-3 text-xs border border-border">
            {/* Phone */}
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Phone
              </span>
              <p className="font-medium text-foreground text-xs truncate">
                {member.phone}
              </p>
            </div>

            {/* Expiry */}
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Expiry Date
              </span>
              <p className="font-medium text-foreground text-xs">
                {member.expiryDate}
              </p>
              {member.isExpiringSoon && (
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-warning">
                  <Clock className="h-3 w-3" />
                  Expiring soon
                </span>
              )}
            </div>

            {/* Fee & Fee Status */}
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Monthly Fee
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground text-xs">
                  {member.monthlyFee}
                </span>
                {member.feeStatus === "PAID" ? (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-[#E5F6EF] border border-success/25 px-1.5 py-0.2 text-[10px] font-semibold text-success">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FEF7EC] border border-warning/25 px-1.5 py-0.2 text-[10px] font-semibold text-warning">
                    <AlertCircle className="h-2.5 w-2.5" />
                    Due
                  </span>
                )}
              </div>
            </div>

            {/* Last Check-in */}
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-muted-foreground">
                Last Check-in
              </span>
              <p className="font-medium text-muted-foreground text-xs">
                {member.lastCheckIn}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-0.5">
            <Link
              href={`/admin/members/${member.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2 text-xs font-medium text-foreground hover:bg-[#F5F8F6] transition-colors"
            >
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              <span>View Profile</span>
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-[#F5F8F6] transition-colors cursor-pointer"
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
