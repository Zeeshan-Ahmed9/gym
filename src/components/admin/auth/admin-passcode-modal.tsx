"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  getAdminPasscodeStatus,
  createAdminPasscodeAction,
  verifyAdminPasscodeAction,
  changeAdminPasscodeAction,
} from "@/server/actions/admin-passcode.actions";

interface AdminPasscodeModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialMode?: "enter" | "create" | "change";
  onSuccessRedirect?: string;
}

export function AdminPasscodeModal({
  isOpen,
  onClose,
  initialMode,
  onSuccessRedirect = "/admin",
}: AdminPasscodeModalProps) {
  const router = useRouter();

  const [mode, setMode] = React.useState<"enter" | "create" | "change">("enter");
  const [loading, setLoading] = React.useState(false);
  const [checkingStatus, setCheckingStatus] = React.useState(true);
  const [isConfigured, setIsConfigured] = React.useState(false);

  // Form states
  const [passcode, setPasscode] = React.useState("");
  const [confirmPasscode, setConfirmPasscode] = React.useState("");
  const [previousPasscode, setPreviousPasscode] = React.useState("");
  const [newPasscode, setNewPasscode] = React.useState("");

  // Visibility toggles
  const [showPass, setShowPass] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showPrev, setShowPrev] = React.useState(false);

  // Feedback states
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Load status whenever modal opens
  React.useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setCheckingStatus(true);
    setError(null);
    setSuccessMsg(null);
    setPasscode("");
    setConfirmPasscode("");
    setPreviousPasscode("");
    setNewPasscode("");

    getAdminPasscodeStatus()
      .then((status) => {
        if (!mounted) return;
        setIsConfigured(status.isConfigured);

        if (initialMode) {
          setMode(initialMode);
        } else if (!status.isConfigured) {
          // If no passcode has been set yet, show "create" mode
          setMode("create");
        } else {
          setMode("enter");
        }
      })
      .catch((err) => {
        console.error("Error checking passcode status:", err);
      })
      .finally(() => {
        if (mounted) setCheckingStatus(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Handle Create Passcode
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passcode.length < 4) {
      setError("Passcode must be at least 4 characters long.");
      return;
    }
    if (passcode !== confirmPasscode) {
      setError("Passcodes do not match. Please re-check.");
      return;
    }

    setLoading(true);
    try {
      const res = await createAdminPasscodeAction(passcode);
      if (res.success) {
        setSuccessMsg("Admin Passcode created successfully! Opening Admin Panel...");
        setTimeout(() => {
          if (onClose) onClose();
          router.push(onSuccessRedirect);
          router.refresh();
        }, 800);
      } else {
        setError(res.error || "Failed to create passcode.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify / Unlock
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passcode) {
      setError("Please enter the admin passcode.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyAdminPasscodeAction(passcode);
      if (res.success) {
        setSuccessMsg("Passcode verified! Access granted.");
        setTimeout(() => {
          if (onClose) onClose();
          router.push(onSuccessRedirect);
          router.refresh();
        }, 700);
      } else {
        setError(res.error || "Incorrect passcode. Please try again.");
      }
    } catch {
      setError("Verification failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Change Passcode ("pehle pechla pass dalo phr he access mile ga")
  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!previousPasscode) {
      setError("Pehle pechla pass dalo (Enter your current previous passcode).");
      return;
    }
    if (newPasscode.length < 4) {
      setError("New passcode must be at least 4 characters.");
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setError("New passcode and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await changeAdminPasscodeAction(previousPasscode, newPasscode);
      if (res.success) {
        setSuccessMsg("Passcode successfully updated! Opening Admin Panel...");
        setTimeout(() => {
          if (onClose) onClose();
          router.push(onSuccessRedirect);
          router.refresh();
        }, 800);
      } else {
        setError(res.error || "Failed to change passcode. Verify previous passcode.");
      }
    } catch {
      setError("Password change failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-[#000000]/85 backdrop-blur-md transition-opacity"
        onClick={() => {
          if (onClose && !loading) onClose();
        }}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0C100E] p-6 sm:p-8 shadow-[0_0_50px_rgba(0,229,170,0.15)] text-white z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Glow behind modal */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-44 w-72 bg-[#00E5AA]/15 blur-3xl rounded-full" />

        {/* Close Button (if dismissible) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Header Icon & Title */}
        <div className="text-center space-y-3 mb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#00A878] to-[#00E5AA] text-[#0A0D0C] shadow-lg shadow-[#00A878]/30">
            {mode === "create" ? (
              <KeyRound className="h-7 w-7 stroke-[2.5]" />
            ) : mode === "change" ? (
              <RefreshCw className="h-7 w-7 stroke-[2.5]" />
            ) : (
              <Shield className="h-7 w-7 stroke-[2.5]" />
            )}
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-sans">
              {mode === "create"
                ? "Create Admin Passcode"
                : mode === "change"
                ? "Change Admin Passcode"
                : "Admin Access Passcode"}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-white/60">
              {mode === "create"
                ? "Set a secure passcode to protect and lock the Admin Control Center."
                : mode === "change"
                ? "Pehle pechla pass dalo (Enter previous passcode) to verify and set a new one."
                : "Hamesha pass dal kr he admin panel open hoga (Enter passcode to proceed)."}
            </p>
          </div>
        </div>

        {/* Loading state while checking DB */}
        {checkingStatus ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 text-white/60 text-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#00E5AA] border-t-transparent" />
            <span>Checking security configuration...</span>
          </div>
        ) : (
          <>
            {/* Feedback Banners */}
            {error && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#00E5AA]/30 bg-[#00E5AA]/10 p-3 text-xs text-[#00E5AA]">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{successMsg}</span>
              </div>
            )}

            {/* 1. CREATE MODE */}
            {mode === "create" && (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    New Admin Passcode
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter minimum 4 characters"
                      required
                      autoFocus
                      disabled={loading}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder-white/30 focus:border-[#00E5AA] focus:outline-none focus:ring-1 focus:ring-[#00E5AA] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Confirm Admin Passcode
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      placeholder="Repeat new passcode"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder-white/30 focus:border-[#00E5AA] focus:outline-none focus:ring-1 focus:ring-[#00E5AA] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00A878] to-[#00E5AA] px-4 py-3 text-sm font-bold text-[#0A0D0C] shadow-lg shadow-[#00A878]/30 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0A0D0C] border-t-transparent" />
                  ) : (
                    <>
                      <span>Create Passcode & Open Admin</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* 2. ENTER / UNLOCK MODE */}
            {mode === "enter" && (
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Admin Passcode
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter your admin passcode"
                      required
                      autoFocus
                      disabled={loading}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder-white/30 focus:border-[#00E5AA] focus:outline-none focus:ring-1 focus:ring-[#00E5AA] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00A878] to-[#00E5AA] px-4 py-3 text-sm font-bold text-[#0A0D0C] shadow-lg shadow-[#00A878]/30 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0A0D0C] border-t-transparent" />
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Unlock & Open Admin Panel</span>
                    </>
                  )}
                </button>

                {/* Change pass link */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                  <span>Need to update password?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSuccessMsg(null);
                      setMode("change");
                    }}
                    className="text-[#00E5AA] hover:underline font-semibold cursor-pointer"
                  >
                    Change Passcode
                  </button>
                </div>
              </form>
            )}

            {/* 3. CHANGE PASSCODE MODE */}
            {mode === "change" && (
              <form onSubmit={handleChange} className="space-y-4">
                {/* Previous Passcode: Essential constraint requested by user */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-white/80">
                      Previous / Current Passcode
                    </label>
                    <span className="text-[10px] text-[#00E5AA] font-mono">Pehle pechla pass</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPrev ? "text" : "password"}
                      value={previousPasscode}
                      onChange={(e) => setPreviousPasscode(e.target.value)}
                      placeholder="Enter previous passcode"
                      required
                      autoFocus
                      disabled={loading}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder-white/30 focus:border-[#00E5AA] focus:outline-none focus:ring-1 focus:ring-[#00E5AA] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPrev(!showPrev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showPrev ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* New Passcode */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    New Passcode
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      placeholder="Minimum 4 characters"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder-white/30 focus:border-[#00E5AA] focus:outline-none focus:ring-1 focus:ring-[#00E5AA] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Passcode */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Confirm New Passcode
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      placeholder="Repeat new passcode"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder-white/30 focus:border-[#00E5AA] focus:outline-none focus:ring-1 focus:ring-[#00E5AA] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00A878] to-[#00E5AA] px-4 py-3 text-sm font-bold text-[#0A0D0C] shadow-lg shadow-[#00A878]/30 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0A0D0C] border-t-transparent" />
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span>Verify Previous Pass & Grant Access</span>
                    </>
                  )}
                </button>

                {/* Back to Enter Passcode */}
                <div className="pt-3 border-t border-white/10 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSuccessMsg(null);
                      setMode("enter");
                    }}
                    className="text-xs text-white/60 hover:text-[#00E5AA] transition-colors cursor-pointer"
                  >
                    ← Back to Enter Passcode
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
