"use client";

import * as React from "react";
import {
  QrCode,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  DoorOpen,
} from "lucide-react";
import type { AttendanceStats } from "@/types/member-dashboard";
import { QrScannerModal } from "./qr-scanner-modal";

interface QrCheckInCardProps {
  attendance: AttendanceStats;
  memberId: string;
  onCheckInSuccess?: (info: { checkInTime: string; gate: string }) => void;
}

export function QrCheckInCard({
  attendance: initialAttendance,
  memberId,
  onCheckInSuccess,
}: QrCheckInCardProps) {
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);
  const [attendance, setAttendance] = React.useState(initialAttendance);

  const handleScanSuccess = (data: { checkInTime: string; gate: string }) => {
    setAttendance((prev) => ({
      ...prev,
      checkedInToday: true,
      todayCheckInTime: data.checkInTime,
      todayGate: data.gate,
      visitsThisMonth: prev.visitsThisMonth + (prev.checkedInToday ? 0 : 1),
    }));

    if (onCheckInSuccess) {
      onCheckInSuccess(data);
    }
  };

  return (
    <>
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs relative overflow-hidden transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Content Area */}
          <div className="space-y-3.5 max-w-xl">
            {/* Small Feature Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
              <DoorOpen className="h-3.5 w-3.5" />
              <span>Fast Turnstile Entry</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Scan Turnstile QR Code
            </h2>

            {/* Subtitle / Description */}
            <p className="text-sm text-[#718078] leading-relaxed">
              Scan the front turnstile or desk QR code to instantly verify your entry and record today&apos;s workout attendance.
            </p>

            {/* Attendance Status Strip */}
            <div className="pt-1 flex items-center gap-2 text-xs font-medium">
              {attendance.checkedInToday ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-accent/70 border border-success/20 px-3 py-1.5 text-foreground animate-in fade-in duration-200">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>
                    Checked in at <span className="font-semibold">{attendance.todayCheckInTime}</span>
                    {attendance.todayGate && (
                      <>
                        <span className="mx-1.5 text-muted-foreground">•</span>
                        <span className="text-[#718078]">{attendance.todayGate}</span>
                      </>
                    )}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-[#718078] py-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>You haven&apos;t checked in today yet</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Button */}
          <div className="shrink-0 flex items-center">
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-primary px-6 py-4 text-sm font-semibold tracking-wide text-white hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <QrCode className="h-5 w-5 stroke-[2.2]" />
              <span className="font-bold">SCAN GYM QR</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        memberId={memberId}
        onSuccess={handleScanSuccess}
      />
    </>
  );
}
