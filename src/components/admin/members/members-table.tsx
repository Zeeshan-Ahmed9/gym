import * as React from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Clock, Edit2, Eye } from "lucide-react";
import type { MemberListItem } from "@/types/member";

interface MembersTableProps {
  members: MemberListItem[];
}

export function MembersTable({ members }: MembersTableProps) {
  return (
    <div className="hidden md:block w-full overflow-hidden rounded-2xl border border-border bg-[#15191D] shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-foreground">
          {/* Table Header */}
          <thead className="border-b border-border bg-card/40 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" className="py-3.5 pl-6 pr-3">
                Member Name
              </th>
              <th scope="col" className="px-3 py-3.5">
                Code
              </th>
              <th scope="col" className="px-3 py-3.5">
                Membership
              </th>
              <th scope="col" className="px-3 py-3.5">
                Expiry Date
              </th>
              <th scope="col" className="px-3 py-3.5">
                Monthly Fee
              </th>
              <th scope="col" className="px-3 py-3.5">
                Fee Status
              </th>
              <th scope="col" className="px-3 py-3.5">
                Last Check-in
              </th>
              <th scope="col" className="py-3.5 pl-3 pr-6 text-right">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border/30">
            {members.map((member) => (
              <tr
                key={member.id}
                className="transition-colors hover:bg-card/30"
              >
                {/* Member Name & Phone */}
                <td className="py-4 pl-6 pr-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary border border-border text-xs font-extrabold text-foreground shadow-inner">
                      {member.initials}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">
                        {member.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {member.phone}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Member Code */}
                <td className="px-3 py-4">
                  <span className="font-mono text-xs font-semibold text-muted-foreground">
                    {member.memberCode}
                  </span>
                </td>

                {/* Membership Status */}
                <td className="px-3 py-4">
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
                </td>

                {/* Expiry Date */}
                <td className="px-3 py-4">
                  <div className="text-xs font-semibold text-foreground">
                    {member.expiryDate}
                  </div>
                  {member.isExpiringSoon && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-warning mt-0.5">
                      <Clock className="h-2.5 w-2.5" />
                      Expiring soon
                    </span>
                  )}
                </td>

                {/* Monthly Fee */}
                <td className="px-3 py-4">
                  <span className="font-semibold text-xs text-foreground">
                    {member.monthlyFee}
                  </span>
                </td>

                {/* Fee Status */}
                <td className="px-3 py-4">
                  {member.feeStatus === "PAID" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 border border-success/30 px-2.5 py-0.5 text-[11px] font-bold text-success">
                      <CheckCircle2 className="h-3 w-3" />
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 border border-warning/30 px-2.5 py-0.5 text-[11px] font-bold text-warning">
                      <AlertCircle className="h-3 w-3" />
                      Due
                    </span>
                  )}
                </td>

                {/* Last Check-in */}
                <td className="px-3 py-4">
                  <span className="text-xs text-muted-foreground font-medium">
                    {member.lastCheckIn}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 pl-3 pr-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/members/${member.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-bold text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-colors cursor-pointer"
                      title="Edit Member"
                      aria-label={`Edit ${member.name}`}
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
