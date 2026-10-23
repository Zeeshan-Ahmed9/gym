"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dumbbell, QrCode, LogOut } from "lucide-react";
import type { MemberInfo, MembershipDetails } from "@/types/member-dashboard";
import { QrScannerModal } from "./qr-scanner-modal";
import { logoutMemberAction } from "@/server/actions/member-auth.actions";

interface MemberNavbarProps {
  member: MemberInfo;
  membership: MembershipDetails;
}

export function MemberNavbar({ member, membership }: MemberNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);

  const navLinks = [
    { label: "Home", href: "/member" },
    { label: "Attendance", href: "/member/attendance" },
    { label: "Progress", href: "/member/progress" },
    { label: "Profile", href: "/member/profile" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/member"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-primary shadow-xs">
            <Dumbbell className="h-5 w-5 stroke-[2.2]" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            FitFlow
          </span>
        </Link>

        {/* Center Navigation Links (Hidden on small mobile, visible sm and up) */}
        <nav className="hidden sm:flex items-center gap-1.5 rounded-full border border-border/80 bg-[#F5F8F6] p-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/member"
                ? pathname === "/member"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all border ${
                  isActive
                    ? "bg-accent text-primary border-primary/25 shadow-xs font-semibold"
                    : "border-transparent text-[#718078] hover:text-foreground hover:bg-card/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Scan QR Button + Member Account Chip */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Compact Scan QR Button */}
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer"
            title="Scan Turnstile QR"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Scan QR</span>
          </button>

          {/* Member Account Chip */}
          <Link
            href="/member/profile"
            className="flex items-center gap-2 rounded-full border border-border bg-card pl-1.5 pr-2.5 py-1 shadow-xs hover:border-[#BAC8BF] transition-all cursor-pointer group"
          >
            {/* Initials Avatar */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-primary text-[11px] font-semibold border border-primary/20 shadow-xs">
              {member.initials}
            </div>

            {/* Name & Code */}
            <div className="text-left leading-tight hidden xs:block">
              <span className="text-xs font-semibold text-foreground block group-hover:text-primary transition-colors">
                {member.name}
              </span>
              <span className="text-[10px] font-mono text-[#718078] block">
                {member.memberCode}
              </span>
            </div>

            {/* Status Badge */}
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                membership.status === "ACTIVE"
                  ? "bg-accent text-success border border-success/20"
                  : "bg-[#FDF2F2] text-danger border border-danger/20"
              }`}
            >
              {membership.status}
            </span>
          </Link>

          {/* Sign Out Button */}
          <button
            id="member-signout-btn"
            type="button"
            onClick={async () => {
              await logoutMemberAction();
              router.push("/member/login");
              router.refresh();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-[#718078] hover:text-danger hover:border-danger/30 hover:bg-[#FDF2F2] transition-all cursor-pointer shadow-2xs"
            title="Sign Out / Switch Gym ID"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* QR Scanner Modal for Navbar */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        memberId={member.id}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* Mobile Secondary Navigation Row (Visible on small screens) */}
      <div className="flex sm:hidden border-t border-border/60 bg-[#F5F8F6] px-4 py-1.5 overflow-x-auto justify-around">
        {navLinks.map((link) => {
          const isActive =
            link.href === "/member"
              ? pathname === "/member"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors border ${
                isActive
                  ? "bg-accent text-primary border-primary/25 font-bold shadow-xs"
                  : "border-transparent text-[#718078] hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
