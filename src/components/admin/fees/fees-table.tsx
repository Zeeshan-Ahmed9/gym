"use client";

import * as React from "react";
import {
  Banknote,
  Building2,
  CreditCard,
  Plus,
  Receipt,
  Clock,
  Calendar,
} from "lucide-react";
import type { FeeRecord } from "@/types/fees";

interface FeesTableProps {
  records: FeeRecord[];
  onViewRecord: (record: FeeRecord) => void;
  onRecordPayment: (record: FeeRecord) => void;
}

export function FeesTable({
  records,
  onViewRecord,
  onRecordPayment,
}: FeesTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary mb-3">
          <Banknote className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No fee records found</h3>
        <p className="mt-1 text-sm text-secondary-foreground max-w-sm">
          No payment records match your current search query or filter selection.
        </p>
      </div>
    );
  }

  const renderStatusBadge = (status: FeeRecord["status"]) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span>Paid</span>
          </span>
        );
      case "Due":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            <span>Due</span>
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" />
            <span>Overdue</span>
          </span>
        );
    }
  };

  const renderMethodBadge = (method: FeeRecord["method"]) => {
    if (!method) {
      return <span className="text-muted-foreground">—</span>;
    }

    const MethodIcon =
      method === "Bank Transfer"
        ? Building2
        : method === "Other"
        ? CreditCard
        : Banknote;

    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-secondary-foreground">
        <MethodIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <span>{method}</span>
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Desktop Table View (md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-[#F5F8F6] text-xs font-semibold text-secondary-foreground">
              <th scope="col" className="py-3.5 pl-6 pr-4">
                Member Details
              </th>
              <th scope="col" className="py-3.5 px-4">
                Member Code
              </th>
              <th scope="col" className="py-3.5 px-4">
                Amount
              </th>
              <th scope="col" className="py-3.5 px-4">
                Month
              </th>
              <th scope="col" className="py-3.5 px-4">
                Payment Date
              </th>
              <th scope="col" className="py-3.5 px-4">
                Method
              </th>
              <th scope="col" className="py-3.5 px-4">
                Status
              </th>
              <th scope="col" className="py-3.5 pl-4 pr-6 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {records.map((record) => {
              const isPaid = record.status === "Paid";

              return (
                <tr
                  key={record.id}
                  className="transition-colors hover:bg-[#F5F8F6]/60 group"
                >
                  {/* MEMBER DETAILS */}
                  <td className="py-4 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary font-bold text-xs">
                        {record.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {record.memberName}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {record.tier}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* MEMBER CODE */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center rounded-lg border border-border bg-[#F5F8F6] px-2 py-0.5 font-mono text-xs font-medium text-secondary-foreground">
                      {record.memberCode}
                    </span>
                  </td>

                  {/* AMOUNT */}
                  <td className="py-4 px-4 font-semibold text-foreground whitespace-nowrap">
                    Rs. {record.amount.toLocaleString()}
                  </td>

                  {/* MONTH */}
                  <td className="py-4 px-4 text-xs font-medium text-secondary-foreground whitespace-nowrap">
                    {record.month}
                  </td>

                  {/* PAYMENT DATE */}
                  <td className="py-4 px-4 text-xs font-medium whitespace-nowrap">
                    {record.paymentDate ? (
                      <span className="text-foreground">{record.paymentDate}</span>
                    ) : (
                      <span className="text-muted-foreground font-mono">—</span>
                    )}
                  </td>

                  {/* METHOD */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {renderMethodBadge(record.method)}
                  </td>

                  {/* STATUS */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {renderStatusBadge(record.status)}
                  </td>

                  {/* ACTION */}
                  <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                    {isPaid ? (
                      <button
                        type="button"
                        onClick={() => onViewRecord(record)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-[#F5F8F6] hover:text-foreground active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                      >
                        <Receipt className="h-3.5 w-3.5" />
                        <span>View</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onRecordPayment(record)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                      >
                        <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>Record Payment</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards (Visible on screens < md) */}
      <div className="block md:hidden divide-y divide-border">
        {records.map((record) => {
          const isPaid = record.status === "Paid";

          return (
            <div
              key={record.id}
              className="p-4 space-y-3 hover:bg-[#F5F8F6]/50 transition-colors"
            >
              {/* Row 1: Member profile & Status Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary font-bold text-xs">
                    {record.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground text-sm truncate">
                      {record.memberName}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center rounded border border-border bg-[#F5F8F6] px-1.5 py-0.5 font-mono text-[11px] font-medium text-secondary-foreground">
                        {record.memberCode}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {record.tier}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">{renderStatusBadge(record.status)}</div>
              </div>

              {/* Row 2: Amount & Month Details */}
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F5F8F6] p-2.5 text-xs">
                <div>
                  <span className="text-xs font-medium text-muted-foreground block">
                    Amount
                  </span>
                  <span className="font-semibold text-foreground text-sm">
                    Rs. {record.amount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground block">
                    Month
                  </span>
                  <span className="font-medium text-foreground">
                    {record.month}
                  </span>
                </div>
              </div>

              {/* Row 3: Payment Date / Method & Action Button */}
              <div className="flex items-center justify-between pt-1 gap-2">
                <div className="text-xs text-muted-foreground space-y-0.5">
                  {record.paymentDate ? (
                    <div className="flex items-center gap-1.5 text-xs text-secondary-foreground">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{record.paymentDate}</span>
                      {record.method && (
                        <span>• {record.method}</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Unpaid</span>
                    </div>
                  )}
                </div>

                <div>
                  {isPaid ? (
                    <button
                      type="button"
                      onClick={() => onViewRecord(record)}
                      className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-[#F5F8F6] hover:text-foreground cursor-pointer shadow-xs"
                    >
                      <Receipt className="h-3.5 w-3.5" />
                      <span>View</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRecordPayment(record)}
                      className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover cursor-pointer shadow-xs"
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Record Payment</span>
                    </button>
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
