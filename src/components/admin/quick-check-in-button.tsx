"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuickCheckInModal } from "./quick-check-in-modal";

import type { DemoMember } from "./quick-check-in-modal";

interface QuickCheckInButtonProps {
  className?: string;
  label?: string;
  icon?: React.ReactNode;
  onCheckInSuccess?: (member: DemoMember) => void;
}

export function QuickCheckInButton({
  className,
  label = "Quick Check-in",
  icon,
  onCheckInSuccess,
}: QuickCheckInButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 shadow-xs select-none cursor-pointer",
          className
        )}
      >
        {icon !== undefined ? icon : <Plus className="h-4 w-4 stroke-[2.5]" />}
        <span>{label}</span>
      </button>

      <QuickCheckInModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCheckInSuccess={onCheckInSuccess}
      />
    </>
  );
}
