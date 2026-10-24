"use client";

import * as React from "react";
import Link from "next/link";
import { Dumbbell, Shield, User, Menu, X, ArrowUpRight } from "lucide-react";
import { AdminPasscodeModal } from "@/components/admin/auth/admin-passcode-modal";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [adminModalOpen, setAdminModalOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "#hero" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Results", href: "#transformations" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#050607]/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 cursor-pointer shrink-0"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00A878] to-[#00E5AA] text-[#0A0D0C] shadow-md shadow-[#00A878]/25">
              <Dumbbell className="h-5 w-5 stroke-[2.4]" />
            </div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-sans">
              IronMan Fitness
            </span>
          </Link>

          {/* Center: Navigation Links (Centered as explicitly requested by user) */}
          <nav className="hidden md:flex items-center justify-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Corner: Admin Panel Button + Member Login */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Member Portal Quick Entry */}
            <Link
              href="/member/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-3.5 py-2 text-xs font-semibold text-white transition-all active:scale-[0.98]"
              title="Member Portal Login"
            >
              <User className="h-3.5 w-3.5 text-[#00E5AA]" />
              <span>Member Login</span>
            </Link>

            {/* Top Right Corner Admin Access Button with Passcode Protection */}
            <button
              type="button"
              id="landing-admin-panel-btn"
              onClick={() => setAdminModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#172620] to-[#20372D] hover:from-[#20372D] hover:to-[#2A4B3C] border border-[#00A878]/40 px-4 py-2 text-xs font-semibold text-[#00E5AA] shadow-sm hover:shadow-[#00A878]/20 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
              title="Admin Portal Access"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Panel</span>
              <ArrowUpRight className="h-3 w-3 opacity-70" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white border border-white/15"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0D1210] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/member/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-xs font-semibold text-white"
              >
                <User className="h-4 w-4 text-[#00E5AA]" />
                <span>Member Portal</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAdminModalOpen(true);
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A878] text-[#0A0D0C] px-4 py-2.5 text-xs font-bold shadow-md cursor-pointer"
              >
                <Shield className="h-4 w-4" />
                <span>Admin Panel</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Admin Passcode Modal Gate */}
      <AdminPasscodeModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onSuccessRedirect="/admin"
      />
    </>
  );
}
