"use client";

import * as React from "react";
import { X, Trash2, AlertTriangle, ShieldAlert, Loader2 } from "lucide-react";
import {
  deleteMemberAction,
  deactivateMemberAction,
} from "@/server/actions/member.actions";

export interface DeleteMemberData {
  id: string;
  name: string;
  memberCode: string;
  phone?: string;
}

export interface DeleteMemberModalProps {
  member: DeleteMemberData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface DeleteMemberContentProps {
  member: DeleteMemberData;
  onClose: () => void;
  onSuccess: () => void;
}

function DeleteMemberContent({ member, onClose, onSuccess }: DeleteMemberContentProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDeactivating, setIsDeactivating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await deleteMemberAction(member.id);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Failed to delete member.");
      }
    } catch {
      setError("An unexpected error occurred while deleting member.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeactivate = async () => {
    setIsDeactivating(true);
    setError(null);

    try {
      const res = await deactivateMemberAction(member.id);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Failed to deactivate member.");
      }
    } catch {
      setError("An unexpected error occurred while deactivating member.");
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      {error && (
        <div className="rounded-xl border border-danger/25 bg-[#FDF2F2] p-3 text-xs text-danger flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Member Card */}
      <div className="rounded-xl border border-border bg-[#F5F8F6] p-4 space-y-1">
        <div className="text-sm font-bold text-foreground">{member.name}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">{member.memberCode}</span>
          {member.phone && (
            <>
              <span>•</span>
              <span>{member.phone}</span>
            </>
          )}
        </div>
      </div>

      <div className="text-xs text-secondary-foreground space-y-2">
        <p>
          Deleting a member will permanently erase their profile and any associated historical records.
        </p>
        <p className="text-muted-foreground">
          <strong>Recommendation:</strong> If you wish to preserve past attendance and payment records, choose <em>Deactivate Membership</em> instead.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-2">
        {/* Safe alternative: Deactivate */}
        <button
          type="button"
          onClick={handleDeactivate}
          disabled={isDeleting || isDeactivating}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-warning/30 bg-[#FEF7EC] px-4 text-xs sm:text-sm font-semibold text-warning hover:bg-[#fdedd5] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
        >
          {isDeactivating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Deactivating...</span>
            </>
          ) : (
            <span>Deactivate Membership (Preserve History)</span>
          )}
        </button>

        {/* Permanent Delete */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isDeactivating}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-danger px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[#b83232] active:scale-[0.99] shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          {isDeleting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Deleting...</span>
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              <span>Permanently Delete Member</span>
            </>
          )}
        </button>

        {/* Cancel */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting || isDeactivating}
          className="flex h-10 w-full items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-secondary-foreground hover:bg-[#F5F8F6] transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function DeleteMemberModal({
  member,
  isOpen,
  onClose,
  onSuccess,
}: DeleteMemberModalProps) {
  React.useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Escape
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-[#17221D]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card text-foreground shadow-2xl transition-all font-sans my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDF2F2] border border-danger/20 text-danger shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Remove Member
              </h2>
              <p className="text-xs text-muted-foreground">
                Choose to deactivate or permanently delete.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-card p-1.5 text-muted-foreground hover:bg-[#F5F8F6] hover:text-foreground transition-all cursor-pointer disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <DeleteMemberContent
          key={member.id}
          member={member}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}
