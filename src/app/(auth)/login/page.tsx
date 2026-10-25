import * as React from "react";
import Link from "next/link";
import { Dumbbell, ArrowRight, ShieldCheck, User } from "lucide-react";

export const metadata = {
  title: "Sign In | FitFlow",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F8F6] p-4 font-sans text-foreground">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary shadow-xs">
            <Dumbbell className="h-6 w-6 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome to FitFlow
          </h1>
          <p className="text-xs text-[#718078]">
            Select a portal to enter the application
          </p>
        </div>

        {/* Portal Shortcuts */}
        <div className="space-y-3 pt-2">
          <Link
            href="/member/login"
            className="flex items-center justify-between rounded-2xl border border-border bg-[#F5F8F6] p-4 hover:border-primary hover:bg-white transition-all shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="text-sm font-semibold text-foreground block">
                  Member Portal
                </span>
                <span className="text-xs text-[#718078] block">
                  QR check-in, visits, streak, and metrics
                </span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-[#718078] group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        <div className="pt-4 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-[#718078] hover:text-[#14211D] transition-colors"
          >
            ← Back to Main Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
