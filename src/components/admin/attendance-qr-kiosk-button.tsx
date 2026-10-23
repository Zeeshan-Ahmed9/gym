"use client";

import * as React from "react";
import { QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { AttendanceQrKioskModal } from "./attendance-qr-kiosk-modal";

interface AttendanceQrKioskButtonProps {
  className?: string;
  gymName?: string;
  label?: string;
}

export function AttendanceQrKioskButton({
  className,
  gymName,
  label = "Attendance QR",
}: AttendanceQrKioskButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        id="admin-attendance-qr-btn"
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-[#F5F8F6] hover:border-primary/40 active:scale-[0.98] transition-all shadow-2xs select-none cursor-pointer",
          className
        )}
      >
        <QrCode className="h-4 w-4 text-primary stroke-[2.2]" />
        <span>{label}</span>
      </button>

      <AttendanceQrKioskModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        gymName={gymName}
      />
    </>
  );
}
