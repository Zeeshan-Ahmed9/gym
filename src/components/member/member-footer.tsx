import * as React from "react";
import Link from "next/link";

export function MemberFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 pt-6 pb-8 border-t border-border/80 text-xs text-[#718078]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Brand copyright */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">FitFlow</span>
          <span>•</span>
          <span>© {currentYear} FitFlow Portal. All rights reserved.</span>
        </div>

        {/* Right: Informational Links */}
        <div className="flex items-center gap-5 font-medium">
          <Link
            href="/terms"
            className="hover:text-[#14211D] transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="hover:text-[#14211D] transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/admin/settings"
            className="hover:text-[#14211D] transition-colors"
          >
            Facility Desk
          </Link>
        </div>
      </div>
    </footer>
  );
}
