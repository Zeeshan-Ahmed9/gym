"use client";

import * as React from "react";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050607] border-t border-white/10 text-white py-8 overflow-hidden select-none">
      {/* Subtle background ambient glow */}
      <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 h-24 w-full max-w-2xl bg-gradient-to-t from-[#00E5AA]/5 to-transparent blur-2xl opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs sm:text-sm text-white/50 font-medium tracking-wide">
          © {currentYear} IronMan Fitness. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
