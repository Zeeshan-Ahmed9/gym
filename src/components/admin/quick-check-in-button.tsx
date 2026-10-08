"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuickCheckInModal } from "./quick-check-in-modal";

interface QuickCheckInButtonProps {
  className?: string;
}

export function QuickCheckInButton({ className }: QuickCheckInButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-extrabold text-[#0B0D0F] hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 shadow-sm shadow-primary/10 select-none cursor-pointer",
          className
        )}
      >
        <Plus className="h-4 w-4 stroke-[3]" />
        <span>Quick Check-in</span>
      </button>

      <QuickCheckInModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
