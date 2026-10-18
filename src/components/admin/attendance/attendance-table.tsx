"use client";

import * as React from "react";
import { QrCode, FileText, Check, Clock, UserCheck } from "lucide-react";
import type { AttendanceRecord } from "@/types/attendance";

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export function AttendanceTable({ records }: AttendanceTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary border border-border text-muted-foreground mb-3">
          <UserCheck className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No check-in records found</h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          No attendance records match your current search query or filter selection.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Desktop Table: visible on md and up */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-[#F5F8F6]/80 text-xs font-semibold text-muted-foreground">
              <th scope="col" className="py-3.5 pl-6 pr-4">
                Member
              </th>
              <th scope="col" className="py-3.5 px-4">
                Member Code
              </th>
              <th scope="col" className="py-3.5 px-4">
                Check-in Time
              </th>
              <th scope="col" className="py-3.5 px-4">
                Method
              </th>
              <th scope="col" className="py-3.5 px-4">
                Membership
              </th>
              <th scope="col" className="py-3.5 pl-4 pr-6 text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70 text-sm">
            {records.map((record) => {
              const isQr = record.method === "QR Code";

              return (
                <tr
                  key={record.id}
                  className="transition-colors hover:bg-[#F5F8F6]/60 group"
                >
                  {/* MEMBER */}
                  <td className="py-4 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pale-mint border border-primary/20 font-bold text-xs text-primary">
                        {record.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {record.memberName}
                        </div>
                        {record.membershipTier && (
                          <div className="text-xs text-muted-foreground truncate">
                            {record.membershipTier}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* MEMBER CODE */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center rounded-md border border-border bg-card px-2 py-0.5 font-mono text-xs font-medium text-muted-foreground">
                      {record.memberCode}
                    </span>
                  </td>

                  {/* CHECK-IN TIME */}
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-foreground text-xs sm:text-sm">
                        {record.checkInTime}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {record.checkInDate}
                      </div>
                    </div>
                  </td>

                  {/* METHOD */}
                  <td className="py-4 px-4">
                    {isQr ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-pale-mint px-2.5 py-1 text-xs font-semibold text-primary">
                        <QrCode className="h-3 w-3" />
                        <span>QR Code</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        <span>Manual</span>
                      </span>
                    )}
                  </td>

                  {/* MEMBERSHIP */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-[#E5F6EF] px-2.5 py-0.5 text-xs font-semibold text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      <span>{record.membershipStatus}</span>
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="py-4 pl-4 pr-6 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full border border-success/25 bg-[#E5F6EF] px-2.5 py-0.5 text-xs font-semibold text-success">
                      <Check className="h-3 w-3 stroke-[2.5]" />
                      <span>Verified</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards */}
      <div className="block md:hidden divide-y divide-border/60">
        {records.map((record) => {
          const isQr = record.method === "QR Code";

          return (
            <div key={record.id} className="p-4 space-y-3 hover:bg-[#F5F8F6]/50 transition-colors">
              {/* Top Row: Avatar, Member details & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pale-mint border border-primary/20 font-bold text-xs text-primary">
                    {record.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground text-sm truncate">
                      {record.memberName}
                    </h4>
                    <span className="inline-flex items-center rounded border border-border bg-card px-1.5 py-0.2 font-mono text-xs font-medium text-muted-foreground mt-0.5">
                      {record.memberCode}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <span className="inline-flex items-center gap-1 rounded-full border border-success/25 bg-[#E5F6EF] px-2 py-0.5 text-[11px] font-semibold text-success shrink-0">
                  <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                  <span>Verified</span>
                </span>
              </div>

              {/* Bottom Row: Check-in Time & Method badge */}
              <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {record.checkInTime} • {record.checkInDate}
                  </span>
                </div>

                <div>
                  {isQr ? (
                    <span className="inline-flex items-center gap-1 rounded-lg border border-primary/25 bg-pale-mint px-2 py-0.5 text-[11px] font-semibold text-primary">
                      <QrCode className="h-2.5 w-2.5" />
                      <span>QR Code</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      <FileText className="h-2.5 w-2.5" />
                      <span>Manual</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
