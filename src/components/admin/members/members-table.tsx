import * as React from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Clock, Edit2, Eye } from "lucide-react";
import type { MemberListItem } from "@/types/member";

interface MembersTableProps {
  members: MemberListItem[];
}

export function MembersTable({ members }: MembersTableProps) {
  return (
    <div className="hidden md:block w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-foreground">
          {/* Table Header */}
          <thead className="border-b border-border bg-[#F5F8F6]/80 text-xs font-semibold text-muted-foreground">
            <tr>
              <th scope="col" className="py-3.5 pl-6 pr-3">
                Member
              </th>
              <th scope="col" className="px-3 py-3.5">
                Member Code
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
          <tbody className="divide-y divide-border/70">
            {members.map((member) => (
              <tr
                key={member.id}
                className="transition-colors hover:bg-[#F5F8F6]/60"
              >
                {/* Member Name & Phone */}
                <td className="py-4 pl-6 pr-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pale-mint border border-primary/20 text-xs font-bold text-primary">
                      {member.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
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
                  <span className="font-mono text-xs font-medium text-muted-foreground">
                    {member.memberCode}
                  </span>
                </td>

                {/* Membership Status */}
                <td className="px-3 py-4">
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
                </td>

                {/* Expiry Date */}
                <td className="px-3 py-4">
                  <div className="text-xs font-medium text-foreground">
                    {member.expiryDate}
                  </div>
                  {member.isExpiringSoon && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-warning mt-0.5">
                      <Clock className="h-3 w-3" />
                      Expiring soon
                    </span>
                  )}
                </td>

                {/* Monthly Fee */}
                <td className="px-3 py-4">
                  <span className="font-medium text-xs text-foreground">
                    {member.monthlyFee}
                  </span>
                </td>

                {/* Fee Status */}
                <td className="px-3 py-4">
                  {member.feeStatus === "PAID" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E5F6EF] border border-success/25 px-2.5 py-0.5 text-xs font-semibold text-success">
                      <CheckCircle2 className="h-3 w-3" />
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF7EC] border border-warning/25 px-2.5 py-0.5 text-xs font-semibold text-warning">
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
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-[#F5F8F6] hover:border-[#BAC8BF] transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>View</span>
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-[#F5F8F6] transition-colors cursor-pointer"
                      title="Edit Member"
                      aria-label={`Edit ${member.name}`}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
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
