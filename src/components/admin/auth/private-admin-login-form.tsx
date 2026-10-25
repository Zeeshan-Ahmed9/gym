"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  KeyRound,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  adminLoginAction,
  adminInitialSetupAction,
} from "@/server/actions/admin-auth.actions";

interface PrivateAdminLoginFormProps {
  isConfigured: boolean;
}

export function PrivateAdminLoginForm({ isConfigured }: PrivateAdminLoginFormProps) {
  const router = useRouter();

  // Mode: "login" or "setup"
  const isSetupMode = !isConfigured;

  // Form states
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError("Please enter your admin password.");
      return;
    }

    if (isSetupMode) {
      if (password.length < 4) {
        setError("Password must be at least 4 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isSetupMode) {
        const res = await adminInitialSetupAction(password, confirmPassword);
        if (!res.success) {
          setError(res.error || "Failed to initialize admin credentials.");
          setLoading(false);
          return;
        }
      } else {
        const res = await adminLoginAction(password);
        if (!res.success) {
          setError(res.error || "Authentication failed. Incorrect password.");
          setLoading(false);
          return;
        }
      }

      setSuccess(true);
      // Brief feedback before navigating into admin panel
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 500);
    } catch {
      setError("A connection error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060709] flex items-center justify-center p-4 sm:p-6 overflow-hidden selection:bg-[#00E5AA] selection:text-black font-sans">
      {/* Background Decorative Ambient Radial Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-[#00E5AA]/15 to-transparent blur-[140px] opacity-70" />
        <div className="absolute -bottom-20 right-1/4 h-[400px] w-[400px] rounded-full bg-emerald-950/25 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Terminal Header Badge */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 shadow-sm">
            <Shield className="h-4 w-4 text-[#00E5AA]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-white/90">
              Private Admin Control
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#00E5AA] animate-pulse" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isSetupMode ? "Setup Admin Access" : "Admin Authentication"}
          </h1>
          <p className="text-xs sm:text-sm text-white/60 max-w-xs mx-auto leading-relaxed">
            {isSetupMode
              ? "Initialize your primary admin credentials stored securely in Neon PostgreSQL."
              : "Enter your private master password to access gym management and member controls."}
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="rounded-3xl border border-white/10 bg-[#0E1311]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Status Alert if Initial Setup */}
          {isSetupMode && (
            <div className="rounded-2xl border border-[#00A878]/30 bg-[#00A878]/10 p-3.5 flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-[#00E5AA] shrink-0 mt-0.5" />
              <div className="text-xs text-white/80 leading-relaxed">
                <span className="font-semibold text-white block mb-0.5">
                  Initial Master Password Setup
                </span>
                No admin account has been configured yet. Set your secret master password below.
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-200 leading-relaxed font-medium">{error}</p>
            </div>
          )}

          {/* Success Confirmation */}
          {success && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center gap-3 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-200 font-semibold">
                Authorization verified. Launching Admin Dashboard...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Primary Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white/80">
                {isSetupMode ? "New Admin Password" : "Admin Master Password"}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    isSetupMode ? "Choose a strong password" : "Enter master password"
                  }
                  autoComplete={isSetupMode ? "new-password" : "current-password"}
                  autoFocus
                  disabled={loading || success}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-11 text-sm text-white placeholder-white/30 focus:border-[#00E5AA] focus:outline-none focus:ring-1 focus:ring-[#00E5AA] transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Setup Mode Only) */}
            {isSetupMode && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white/80">
                  Confirm Admin Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat chosen password"
                    autoComplete="new-password"
                    disabled={loading || success}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-11 text-sm text-white placeholder-white/30 focus:border-[#00E5AA] focus:outline-none focus:ring-1 focus:ring-[#00E5AA] transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#00E5AA] to-[#00A878] hover:from-[#00F5B8] hover:to-[#00B884] px-5 py-3.5 text-sm font-bold text-black shadow-lg shadow-[#00E5AA]/20 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : isSetupMode ? (
                <>
                  <span>Save Password & Unlock Admin</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 border-t border-white/5 text-center">
            <p className="text-[11px] text-white/40">
              Protected by bcrypt password hashing & secure HTTP-only cookies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
