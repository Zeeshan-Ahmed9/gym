"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  QrCode,
  CreditCard,
  Settings,
  Dumbbell,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function AdminSidebar({
  isOpen = false,
  onClose,
  className,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutGrid,
      isActive: pathname === "/admin",
    },
    {
      label: "Members",
      href: "/admin/members",
      icon: Users,
      isActive: pathname.startsWith("/admin/members"),
    },
    {
      label: "Attendance",
      href: "/admin/attendance",
      icon: QrCode,
      isActive: pathname.startsWith("/admin/attendance"),
    },
    {
      label: "Fees",
      href: "/admin/fees",
      icon: CreditCard,
      isActive: pathname.startsWith("/admin/fees"),
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
      isActive: pathname.startsWith("/admin/settings"),
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 bg-card">
      {/* Top: Logo & Nav */}
      <div className="space-y-6">
        {/* Brand Logo & Name */}
        <div className="flex items-center justify-between px-2 pt-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 group transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pale-mint border border-primary/20 text-primary shadow-xs">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-foreground block leading-tight">
                PulseGym
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Admin Center
              </span>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors select-none",
                  item.isActive
                    ? "bg-pale-mint text-primary font-semibold"
                    : "text-muted-foreground hover:bg-[#F5F8F6] hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    item.isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Subtle Gym Info / Version */}
      <div className="pt-4 border-t border-border">
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Front Desk Portal</p>
          <p className="text-[11px] text-muted-foreground/80 mt-0.5">Management & Operations</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex md:w-60 lg:w-64 flex-col shrink-0 border-r border-border bg-card",
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-[#17221D]/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 w-72 max-w-[85vw] border-r border-border bg-card shadow-xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
