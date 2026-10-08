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
    <div className="flex h-full flex-col justify-between p-4 bg-[#0B0D0F]">
      {/* Top: Logo & Nav */}
      <div className="space-y-6">
        {/* Brand Logo & Name */}
        <div className="flex items-center justify-between px-2 pt-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 group transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-primary shadow-inner">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-foreground">
                  FitFlow
                </span>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                IRONPULSE GYM
              </p>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-card hover:text-foreground md:hidden"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-150 select-none",
                  item.isActive
                    ? "bg-primary text-[#0B0D0F] shadow-sm font-bold"
                    : "text-muted-foreground hover:bg-card hover:text-foreground active:scale-[0.98]"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    item.isActive ? "text-[#0B0D0F]" : "text-muted-foreground"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: System Status */}
      <div className="pt-4 border-t border-border/60">
        <div className="flex items-center justify-between rounded-xl bg-card/60 border border-border/80 px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-[11px] font-bold tracking-wide uppercase text-foreground">
              KIOSK ACTIVE
            </span>
          </div>
          <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-semibold text-primary">
            Live
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex md:w-60 lg:w-64 flex-col shrink-0 border-r border-border bg-[#0B0D0F]",
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 w-72 max-w-[85vw] border-r border-border bg-[#0B0D0F] shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
