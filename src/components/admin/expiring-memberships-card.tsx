import * as React from "react";
import { Bell, Calendar, Send, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExpiringMembershipItem } from "@/types/dashboard";

interface ExpiringMembershipsCardProps {
  expiringMembers: ExpiringMembershipItem[];
  className?: string;
}

export function ExpiringMembershipsCard({
  expiringMembers,
  className,
}: ExpiringMembershipsCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs",
        className
      )}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Memberships Expiring Soon
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Renewals requiring attention this week
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FEF7EC] border border-warning/20 text-warning">
            <Bell className="h-4 w-4" />
          </div>
        </div>

        {/* Expiring List */}
        <div className="divide-y divide-border/60 pt-1">
          {expiringMembers.map((item) => (
            <div key={item.id} className="py-3.5 space-y-2.5">
              {/* Member & Days Left */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-bold",
                      item.urgency === "urgent"
                        ? "bg-[#FDF2F2] border-danger/25 text-danger"
                        : "bg-[#FEF7EC] border-warning/25 text-warning"
                    )}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">{item.plan}</p>
                  </div>
                </div>

                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    item.urgency === "urgent"
                      ? "bg-[#FDF2F2] border-danger/25 text-danger"
                      : "bg-[#FEF7EC] border-warning/25 text-warning"
                  )}
                >
                  {item.daysRemaining} days left
                </span>
              </div>

              {/* Expiry Date & Action */}
              <div className="flex items-center justify-between pl-12 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" />
                  <span className="text-xs">{item.expiryDate}</span>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-[#F5F8F6] hover:border-[#BAC8BF] transition-colors cursor-pointer"
                >
                  <Send className="h-3 w-3 text-muted-foreground" />
                  <span>Send Reminder</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Batch Action */}
      <div className="pt-4 border-t border-border mt-2">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-[#F5F8F6] px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary active:scale-[0.99] transition-all cursor-pointer"
        >
          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Batch Reminder to All Expiring</span>
        </button>
      </div>
    </div>
  );
}
