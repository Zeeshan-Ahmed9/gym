"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dumbbell,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  UserCheck,
  Lock,
} from "lucide-react";
import {
  verifyMemberGymIdAction,
  setupMemberPasswordAction,
  loginMemberWithPasswordAction,
} from "@/server/actions/member-auth.actions";

export function MemberLoginPortal() {
  const router = useRouter();

  // Step 1: Gym ID Verification
  const [gymId, setGymId] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [verifyError, setVerifyError] = React.useState<string | null>(null);

  // Step 2: Verification Result State
  const [verifiedMember, setVerifiedMember] = React.useState<{
    memberId: string;
    memberCode: string;
    name: string;
    isActivated: boolean;
  } | null>(null);

  // Form inputs for Password
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Handle Step 1: Verify Gym ID
  const handleVerifyGymId = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);
    setActionError(null);

    const code = gymId.trim();
    if (!code) {
      setVerifyError("Please enter your Gym ID (e.g. GYM-54110).");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await verifyMemberGymIdAction(code);
      if (res.success && res.data) {
        setVerifiedMember(res.data);
        setPassword("");
        setConfirmPassword("");
      } else {
        setVerifyError(res.error || "Gym ID not found.");
      }
    } catch {
      setVerifyError("A network error occurred while verifying Gym ID.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Step 2A: Set Password (First-Time Activation)
  const handleSetupPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    if (!password || password.length < 6) {
      setActionError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setActionError("Passwords do not match.");
      return;
    }

    if (!verifiedMember) return;

    setIsSubmitting(true);
    try {
      const res = await setupMemberPasswordAction({
        memberCode: verifiedMember.memberCode,
        password,
        confirmPassword,
      });

      if (res.success) {
        setSuccessMsg("Password set successfully! Redirecting to your dashboard...");
        setTimeout(() => {
          window.location.href = "/member";
        }, 800);
      } else {
        setActionError(res.error || "Failed to set password.");
      }
    } catch {
      setActionError("A network error occurred while saving password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Step 2B: Returning Member Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    if (!password) {
      setActionError("Please enter your password.");
      return;
    }

    if (!verifiedMember) return;

    setIsSubmitting(true);
    try {
      const res = await loginMemberWithPasswordAction({
        memberCode: verifiedMember.memberCode,
        password,
      });

      if (res.success) {
        setSuccessMsg("Welcome back! Redirecting to your dashboard...");
        setTimeout(() => {
          window.location.href = "/member";
        }, 600);
      } else {
        setActionError(res.error || "Incorrect password. Please try again.");
      }
    } catch {
      setActionError("A network error occurred while logging in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to Step 1
  const handleSwitchGymId = () => {
    setVerifiedMember(null);
    setPassword("");
    setConfirmPassword("");
    setVerifyError(null);
    setActionError(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F8F6] p-4 sm:p-6 font-sans text-foreground">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl transition-all">
        {/* Brand Header */}
        <div className="text-center space-y-2 pb-5 border-b border-border/80">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary shadow-xs">
            <Dumbbell className="h-6 w-6 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            FitFlow Member Portal
          </h1>
          <p className="text-xs text-[#718078] font-medium">
            Enter with your assigned Gym ID to access workouts and attendance.
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-accent border border-primary/30 p-3.5 text-xs text-primary font-bold animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Enter Gym ID */}
        {!verifiedMember ? (
          <form onSubmit={handleVerifyGymId} className="mt-6 space-y-4">
            {verifyError && (
              <div className="flex items-center gap-2 rounded-2xl bg-[#FDF2F2] border border-danger/25 p-3.5 text-xs text-danger animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="member-gym-id-input"
                className="block text-xs font-semibold text-foreground"
              >
                Gym ID (Member Code)
              </label>
              <div className="relative">
                <input
                  id="member-gym-id-input"
                  type="text"
                  value={gymId}
                  onChange={(e) => {
                    setGymId(e.target.value);
                    if (verifyError) setVerifyError(null);
                  }}
                  placeholder="e.g. GYM-54110"
                  disabled={isVerifying}
                  className="w-full uppercase font-mono tracking-wider rounded-2xl border border-border bg-[#F9FBFA] px-4 py-3 text-sm font-semibold text-foreground focus:border-primary focus:bg-card focus:outline-hidden transition-all shadow-2xs"
                  required
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-[#718078]">
                Provided on your registration receipt or gym membership card.
              </p>
            </div>

            <button
              id="verify-gym-id-submit-btn"
              type="submit"
              disabled={isVerifying}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-xs font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Gym ID...</span>
                </>
              ) : (
                <>
                  <span>Verify Gym ID</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : verifiedMember.isActivated ? (
          /* STEP 2B: Returning Member Login (Password already set) */
          <form onSubmit={handleLogin} className="mt-6 space-y-4 animate-in fade-in">
            {/* Verified Member Badge */}
            <div className="rounded-2xl bg-accent/60 border border-primary/25 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white text-xs font-semibold">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">
                    {verifiedMember.name}
                  </h3>
                  <span className="font-mono text-[10px] text-primary font-semibold">
                    {verifiedMember.memberCode}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSwitchGymId}
                className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
              >
                Change ID
              </button>
            </div>

            {actionError && (
              <div className="flex items-center gap-2 rounded-2xl bg-[#FDF2F2] border border-danger/25 p-3.5 text-xs text-danger animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="member-login-password"
                className="block text-xs font-semibold text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="member-login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-border bg-[#F9FBFA] pl-4 pr-11 py-3 text-xs font-medium text-foreground focus:border-primary focus:bg-card focus:outline-hidden transition-all shadow-2xs"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#718078] hover:text-[#14211D] cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              id="member-signin-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-xs font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Sign In to Member Portal</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2A: First-Time Password Activation */
          <form onSubmit={handleSetupPassword} className="mt-6 space-y-4 animate-in fade-in">
            {/* First-time Activation Banner */}
            <div className="rounded-2xl bg-accent border border-primary/30 p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  First-Time Account Setup
                </span>
                <button
                  type="button"
                  onClick={handleSwitchGymId}
                  className="text-[11px] font-semibold text-[#718078] hover:underline cursor-pointer"
                >
                  Change ID
                </button>
              </div>
              <p className="text-xs text-[#14211D] font-medium leading-relaxed">
                Welcome, <strong>{verifiedMember.name}</strong> ({verifiedMember.memberCode})! Create a password to protect your account. No one else will be able to access your portal without it.
              </p>
            </div>

            {actionError && (
              <div className="flex items-center gap-2 rounded-2xl bg-[#FDF2F2] border border-danger/25 p-3.5 text-xs text-danger animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {/* Create Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="setup-password-input"
                className="block text-xs font-semibold text-foreground"
              >
                Create Password (min. 6 characters)
              </label>
              <div className="relative">
                <input
                  id="setup-password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a strong password"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-border bg-[#F9FBFA] pl-4 pr-11 py-3 text-xs font-medium text-foreground focus:border-primary focus:bg-card focus:outline-hidden transition-all shadow-2xs"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#718078] hover:text-[#14211D] cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="setup-confirm-password-input"
                className="block text-xs font-semibold text-foreground"
              >
                Confirm Password
              </label>
              <input
                id="setup-confirm-password-input"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-border bg-[#F9FBFA] px-4 py-3 text-xs font-medium text-foreground focus:border-primary focus:bg-card focus:outline-hidden transition-all shadow-2xs"
                required
              />
            </div>

            <button
              id="member-setup-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-xs font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Activating Account...</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  <span>Set Password & Enter Portal</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="mt-6 pt-4 border-t border-border/80 flex items-center justify-between text-xs text-[#718078]">
          <Link
            href="/"
            className="hover:text-[#14211D] transition-colors font-medium"
          >
            ← Back to Home
          </Link>

          <Link
            href="/terms"
            className="hover:text-[#14211D] transition-colors"
          >
            Terms & Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
