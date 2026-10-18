"use client";

import * as React from "react";
import { BookOpen, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SettingsGuidelinesCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
          <BookOpen className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Configuration Notes
          </h3>
          <p className="mt-0.5 text-xs text-secondary-foreground leading-relaxed">
            These parameters represent global defaults for front-desk operations.
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-border space-y-2 text-xs text-secondary-foreground">
        <div className="flex items-start gap-2">
          <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <span>Gym name and logo appear on invoices, receipts, and headers.</span>
        </div>
        <div className="flex items-start gap-2">
          <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <span>Existing member billing schedules and expiry dates remain unchanged.</span>
        </div>
      </div>

      <div className="pt-1">
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline group"
        >
          <span>View registered members</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
