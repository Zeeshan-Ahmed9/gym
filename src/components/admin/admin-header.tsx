"use client";

import * as React from "react";
import { Search, Bell, Menu, User } from "lucide-react";

interface AdminHeaderProps {
  onOpenMobileMenu?: () => void;
  terminalName?: string;
  adminName?: string;
}

export function AdminHeader({
  onOpenMobileMenu,
  terminalName = "Front Desk 01",
}: AdminHeaderProps) {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-[#0B0D0F]/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Left: Terminal status indicator & Mobile Menu Trigger */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground md:hidden transition-colors"
            aria-label="Open sidebar navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex items-center gap-2 rounded-lg bg-card border border-border/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">TERMINAL:</span>
          <span className="text-foreground font-bold">{terminalName}</span>
        </div>
      </div>

      {/* Right: Quick Find, Notification, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Find (Search) */}
        <div className="relative hidden sm:flex items-center">
          <div className="pointer-events-none absolute left-3 text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
          </div>
          <input
            type="text"
            readOnly
            placeholder="Quick find (Ctrl+K)"
            className="h-9 w-44 md:w-56 rounded-xl border border-border bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/70 transition-colors focus:outline-none focus:border-primary/50 cursor-pointer"
          />
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        {/* Admin Profile Avatar */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:border-primary/50 transition-colors"
          aria-label="User Profile"
        >
          <User className="h-4 w-4 text-foreground" />
        </button>
      </div>
    </header>
  );
}
