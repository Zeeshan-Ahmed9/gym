"use client";

import * as React from "react";
import { X, Search, Check, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuickCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = "input" | "found" | "success";

interface DemoMember {
  name: string;
  code: string;
  membershipStatus: string;
  expiryDate: string;
  feeStatus: string;
  checkInTime: string;
}

const DEMO_MEMBER: DemoMember = {
  name: "Ahmed Khan",
  code: "GYM-48291",
  membershipStatus: "Active",
  expiryDate: "27 Nov 2026",
  feeStatus: "Paid",
  checkInTime: "Today • 7:32 PM",
};

export function QuickCheckInModal({ isOpen, onClose }: QuickCheckInModalProps) {
  const [step, setStep] = React.useState<ModalStep>("input");
  const [memberCode, setMemberCode] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const resetState = React.useCallback(() => {
    setStep("input");
    setMemberCode("");
    setErrorMessage(null);
  }, []);

  const handleClose = React.useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  // Focus input on open and lock body scroll
  React.useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Escape key
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleFindMember = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = memberCode.trim().toUpperCase();

    if (!trimmed) {
      setErrorMessage("Please check the member code and try again.");
      return;
    }

    if (trimmed === DEMO_MEMBER.code) {
      setErrorMessage(null);
      setStep("found");
    } else {
      setErrorMessage("Member not found");
    }
  };

  const handleConfirmCheckIn = () => {
    setStep("success");
  };

  const handleCancel = () => {
    setStep("input");
    setErrorMessage(null);
  };

  const handleDone = () => {
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-check-in-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog Content */}
      <div
        className={cn(
          "relative z-10 w-full max-w-[480px] rounded-2xl border border-[#232930] bg-[#15191D] p-6 text-[#F5F7F2] shadow-2xl shadow-black/80 transition-all font-sans"
        )}
      >
        {/* Top-right Close X button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 rounded-lg border border-[#232930] bg-[#1B2025]/80 p-1.5 text-[#8B9299] hover:border-[#8B9299]/30 hover:bg-[#232930] hover:text-[#F5F7F2] transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="pr-10 pb-5">
          <h2
            id="quick-check-in-title"
            className="text-xl font-bold tracking-tight text-[#F5F7F2]"
          >
            Quick Check-in
          </h2>
          <p className="mt-1 text-sm text-[#8B9299]">
            Enter a member&apos;s code to record their attendance.
          </p>
        </div>

        {/* STEP 1: Code Input */}
        {step === "input" && (
          <form onSubmit={handleFindMember} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="member-code-input"
                className="block text-xs font-semibold uppercase tracking-wider text-[#8B9299]"
              >
                Member Code
              </label>

              <div className="relative flex items-center">
                {/* 123 Icon Badge */}
                <div className="pointer-events-none absolute left-3.5 flex items-center text-[#8B9299]">
                  <span className="flex items-center justify-center rounded border border-[#3A424C] bg-[#1E242B] px-1 py-0.5 font-mono text-[10px] font-bold tracking-tighter text-[#8B9299]">
                    123
                  </span>
                </div>

                <input
                  id="member-code-input"
                  ref={inputRef}
                  type="text"
                  value={memberCode}
                  onChange={(e) => {
                    setMemberCode(e.target.value.toUpperCase());
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="GYM-48291"
                  aria-label="Enter member code"
                  className={cn(
                    "h-12 w-full rounded-xl border border-[#232930] bg-[#1A1F24] pl-12 pr-4 font-mono text-sm sm:text-base font-semibold tracking-wider text-[#F5F7F2] placeholder:text-[#8B9299]/40 focus:border-[#B7F34A] focus:outline-none focus:ring-1 focus:ring-[#B7F34A] transition-colors",
                    errorMessage && "border-danger focus:border-danger focus:ring-danger"
                  )}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>

              {/* Sample codes helper chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-[#8B9299]">Sample codes:</span>
                <button
                  type="button"
                  onClick={() => {
                    setMemberCode("GYM-48291");
                    setErrorMessage(null);
                  }}
                  className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  GYM-48291 (Valid)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMemberCode("GYM-99999");
                    setErrorMessage(null);
                  }}
                  className="rounded-full border border-danger/30 bg-danger/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-danger hover:bg-danger/20 transition-colors cursor-pointer"
                >
                  GYM-99999 (Invalid)
                </button>
              </div>
            </div>

            {/* Error Message: Simple, elegant display */}
            {errorMessage && (
              <div className="rounded-xl border border-danger/30 bg-danger/10 p-3.5 text-xs sm:text-sm text-danger flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Member not found</p>
                  <p className="text-danger/90 text-xs">
                    Please check the member code and try again.
                  </p>
                </div>
              </div>
            )}

            {/* Primary button: Find Member */}
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-extrabold text-[#0B0D0F] hover:bg-primary-hover active:scale-[0.99] transition-all shadow-md shadow-primary/10 select-none cursor-pointer"
            >
              <Search className="h-4 w-4 stroke-[2.5]" />
              <span>Find Member</span>
            </button>
          </form>
        )}

        {/* STEP 2: Member Found State */}
        {step === "found" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Member Card */}
            <div className="rounded-xl border border-[#232930] bg-[#1A1F24] p-4 sm:p-5 space-y-4">
              {/* Member Profile */}
              <div className="flex items-center gap-3.5 pb-3.5 border-b border-[#232930]/80">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#232930] border border-[#2F3742] text-sm font-extrabold text-[#F5F7F2] shadow-inner">
                  AK
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-extrabold text-[#F5F7F2] truncate">
                    {DEMO_MEMBER.name}
                  </h3>
                  <div className="mt-0.5 inline-flex items-center rounded-md border border-[#232930] bg-[#15191D] px-2 py-0.5 font-mono text-xs font-semibold text-[#8B9299]">
                    {DEMO_MEMBER.code}
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-3.5 text-xs">
                {/* Membership */}
                <div className="space-y-1">
                  <span className="text-[#8B9299] block font-medium">Membership</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/15 px-2.5 py-0.5 font-bold text-success text-[11px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {DEMO_MEMBER.membershipStatus}
                  </span>
                </div>

                {/* Expiry */}
                <div className="space-y-1">
                  <span className="text-[#8B9299] block font-medium">Expiry</span>
                  <span className="font-semibold text-[#F5F7F2] text-xs sm:text-sm">
                    {DEMO_MEMBER.expiryDate}
                  </span>
                </div>

                {/* Fee Status */}
                <div className="space-y-1">
                  <span className="text-[#8B9299] block font-medium">Fee Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/15 px-2.5 py-0.5 font-bold text-success text-[11px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {DEMO_MEMBER.feeStatus}
                  </span>
                </div>

                {/* Check-in time */}
                <div className="space-y-1">
                  <span className="text-[#8B9299] block font-medium">Check-in time</span>
                  <div className="flex items-center gap-1.5 font-semibold text-[#F5F7F2] text-xs sm:text-sm">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>{DEMO_MEMBER.checkInTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons: Primary & Secondary */}
            <div className="flex flex-col gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleConfirmCheckIn}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-extrabold text-[#0B0D0F] hover:bg-primary-hover active:scale-[0.99] transition-all shadow-md shadow-primary/10 select-none cursor-pointer"
              >
                <span>Confirm Check-in</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#232930] bg-[#1A1F24] px-4 text-sm font-semibold text-[#F5F7F2] hover:bg-[#232930] active:scale-[0.99] transition-colors select-none cursor-pointer"
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success State */}
        {step === "success" && (
          <div className="flex flex-col items-center text-center py-2 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Success Checkmark Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 border border-primary/30 text-primary shadow-lg shadow-primary/10">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>

            {/* Success Heading */}
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-[#F5F7F2] tracking-tight">
                Check-in Successful
              </h3>
            </div>

            {/* Member Details */}
            <div className="w-full rounded-xl border border-[#232930] bg-[#1A1F24] p-4 text-center space-y-2">
              <div className="text-base font-extrabold text-[#F5F7F2]">
                {DEMO_MEMBER.name}
              </div>
              <div>
                <span className="inline-flex items-center rounded-md border border-[#232930] bg-[#15191D] px-2.5 py-0.5 font-mono text-xs font-semibold text-[#8B9299]">
                  {DEMO_MEMBER.code}
                </span>
              </div>
              <div className="flex items-center justify-center gap-1.5 pt-1 text-xs font-medium text-[#8B9299]">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>{DEMO_MEMBER.checkInTime}</span>
              </div>
            </div>

            {/* Done Button */}
            <button
              type="button"
              onClick={handleDone}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-extrabold text-[#0B0D0F] hover:bg-primary-hover active:scale-[0.99] transition-all shadow-md shadow-primary/10 select-none cursor-pointer"
            >
              <span>Done</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
