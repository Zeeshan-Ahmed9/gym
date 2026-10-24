"use client";

import * as React from "react";
import { X, User, Phone, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateMemberSelfAction } from "@/server/actions/member.actions";
import type { MemberInfo } from "@/types/member-dashboard";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberInfo;
  onSuccess: (updated: { name: string; phone: string; email: string }) => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  member,
  onSuccess,
}: EditProfileModalProps) {
  const [name, setName] = React.useState(member.name);
  const [phone, setPhone] = React.useState(member.phone);
  const [email, setEmail] = React.useState(member.email);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Sync state when member changes
  const [prevMember, setPrevMember] = React.useState(member);
  if (prevMember !== member) {
    setPrevMember(member);
    setName(member.name);
    setPhone(member.phone);
    setEmail(member.email);
    setErrorMsg(null);
  }

  // Handle ESC key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (!phone.trim()) {
      setErrorMsg("Please enter your phone number.");
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await updateMemberSelfAction({
        id: member.id,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
      });

      if (res.success && res.data) {
        onSuccess({
          name: res.data.name,
          phone: res.data.phone,
          email: res.data.email,
        });
        onClose();
      } else {
        setErrorMsg(res.error || "Failed to update profile.");
      }
    } catch {
      setErrorMsg("A network error occurred while updating profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#17221D]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-6 text-foreground shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="close-edit-profile-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full border border-border bg-card p-2 text-[#718078] hover:bg-[#F5F8F6] hover:text-foreground transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="pr-10 pb-4 border-b border-border">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-primary mb-2">
            <User className="h-3.5 w-3.5" />
            <span>Profile Settings</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#14211D]">
            Edit Personal Details
          </h2>
          <p className="mt-1 text-xs text-[#718078]">
            Update your registered account name and contact information.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="my-5 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-[#FDF2F2] border border-danger/25 p-3 text-xs text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name Field */}
          <div className="space-y-1.5">
            <label htmlFor="edit-profile-name-input" className="text-xs font-bold text-[#14211D] flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#718078]" />
              <span>Full Name</span>
            </label>
            <input
              id="edit-profile-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Zohaib Khan"
              className="w-full rounded-xl border border-border bg-[#F9FBFA] px-3.5 py-2.5 text-xs font-semibold text-[#14211D] focus:border-primary focus:bg-card focus:outline-hidden transition-all shadow-2xs"
              required
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label htmlFor="edit-profile-phone-input" className="text-xs font-bold text-[#14211D] flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[#718078]" />
              <span>Phone Number</span>
            </label>
            <input
              id="edit-profile-phone-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 03197045252"
              className="w-full rounded-xl border border-border bg-[#F9FBFA] px-3.5 py-2.5 text-xs font-semibold text-[#14211D] focus:border-primary focus:bg-card focus:outline-hidden transition-all shadow-2xs"
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="edit-profile-email-input" className="text-xs font-bold text-[#14211D] flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-[#718078]" />
              <span>Email Address</span>
            </label>
            <input
              id="edit-profile-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. zeeshan@gmail.com"
              className="w-full rounded-xl border border-border bg-[#F9FBFA] px-3.5 py-2.5 text-xs font-semibold text-[#14211D] focus:border-primary focus:bg-card focus:outline-hidden transition-all shadow-2xs"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 space-y-2">
            <button
              id="edit-profile-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 stroke-[2.2]" />
                  <span>Save Changes</span>
                </>
              )}
            </button>

            <button
              id="edit-profile-cancel-btn"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-[#718078] hover:bg-[#F5F8F6] hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
