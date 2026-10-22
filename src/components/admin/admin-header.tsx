"use client";

import * as React from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  onOpenMobileMenu?: () => void;
  terminalName?: string;
  adminName?: string;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/admin/members?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Menu Trigger & Gym Label */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden transition-colors cursor-pointer"
            aria-label="Open sidebar navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">IronMan Admin Center</span>
          <span>•</span>
          <span>Operations & Management</span>
        </div>
      </div>

      {/* Right: Quick Find, Notification, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Find (Search) */}
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:flex items-center">
          <div className="pointer-events-none absolute left-3 text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search members (Enter)..."
            className="h-9 w-48 md:w-60 rounded-xl border border-border bg-[#F5F8F6] pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/70 transition-colors focus:outline-none focus:bg-card focus:border-primary/50"
          />
        </form>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => alert("All systems operational. No unread alerts.")}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-[#F5F8F6] hover:text-foreground transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        {/* Admin Profile Avatar */}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-pale-mint text-primary font-bold text-xs select-none"
          title="Admin Profile"
        >
          AD
        </div>
      </div>
    </header>
  );
}
