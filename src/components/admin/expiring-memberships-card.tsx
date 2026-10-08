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
        "flex flex-col justify-between rounded-2xl border border-border bg-[#15191D] p-5 sm:p-6 shadow-sm",
        className
      )}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/50 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-foreground tracking-tight">
              Memberships Expiring
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Urgent renewals this week
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-danger/10 border border-danger/20 text-danger">
            <Bell className="h-4 w-4" />
          </div>
        </div>

        {/* Expiring List */}
        <div className="divide-y divide-border/30 pt-1">
          {expiringMembers.map((item) => (
            <div key={item.id} className="py-3.5 space-y-2.5">
              {/* Member & Days Left */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-bold",
                      item.urgency === "urgent"
                        ? "bg-danger/10 border-danger/30 text-danger"
                        : "bg-warning/10 border-warning/30 text-warning"
                    )}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">{item.plan}</p>
                  </div>
                </div>

                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide",
                    item.urgency === "urgent"
                      ? "bg-danger/15 border-danger/30 text-danger"
                      : "bg-warning/15 border-warning/30 text-warning"
                  )}
                >
                  {item.daysRemaining} DAYS LEFT
                </span>
              </div>

              {/* Expiry Date & Action */}
              <div className="flex items-center justify-between pl-12 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" />
                  <span className="text-[11px]">{item.expiryDate}</span>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
                >
                  <Send className="h-3 w-3" />
                  <span>Send Reminder</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Batch Action */}
      <div className="pt-4 border-t border-border/50 mt-2">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-xs font-bold text-foreground hover:bg-card hover:border-muted-foreground/30 active:scale-[0.99] transition-all cursor-pointer"
        >
          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Batch WhatsApp Notification (All 14 Members)</span>
        </button>
      </div>
    </div>
  );
}
