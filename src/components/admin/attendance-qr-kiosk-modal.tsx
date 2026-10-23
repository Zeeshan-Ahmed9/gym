"use client";

import * as React from "react";
import { X, QrCode, Printer, Maximize2, Minimize2, Copy, Check, Sparkles, Building2 } from "lucide-react";
import QRCode from "qrcode";

interface AttendanceQrKioskModalProps {
  isOpen: boolean;
  onClose: () => void;
  gymName?: string;
  gateCode?: string;
}

export function AttendanceQrKioskModal({
  isOpen,
  onClose,
  gymName = "FitFlow Flagship Club",
  gateCode = "FITFLOW-TURNSTILE-GATE01",
}: AttendanceQrKioskModalProps) {
  const [qrDataUrl, setQrDataUrl] = React.useState<string>("");
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Generate QR Code data URL when modal opens
  React.useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(gateCode, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 320,
      color: {
        dark: "#14211D",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Error generating attendance QR:", err));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, gateCode, isFullscreen, onClose]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gateCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#17221D]/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative z-10 w-full rounded-3xl border border-border bg-card p-6 sm:p-8 text-foreground shadow-2xl transition-all duration-300 font-sans ${
          isFullscreen
            ? "fixed inset-0 m-0 max-w-none h-full rounded-none flex flex-col items-center justify-center bg-[#F5F8F6]"
            : "max-w-md animate-in fade-in zoom-in-95"
        }`}
      >
        {/* Top Controls */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-full border border-border bg-card p-2 text-muted-foreground hover:bg-[#F5F8F6] hover:text-foreground transition-all cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Kiosk Mode"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border bg-card p-2 text-muted-foreground hover:bg-[#F5F8F6] hover:text-foreground transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Header */}
        <div className="text-center pb-4 border-b border-border/80 w-full max-w-sm">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary mb-2.5">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <Building2 className="h-3.5 w-3.5" />
            <span>{gymName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#14211D]">
            Gym Attendance QR
          </h2>
          <p className="mt-1 text-xs text-muted-foreground font-medium">
            Members can point their FitFlow camera or tap &apos;Scan QR&apos; to instantly log entry.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative rounded-3xl border-2 border-border/80 bg-white p-5 shadow-xl hover:shadow-2xl transition-shadow flex flex-col items-center">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="Gym Attendance QR Code"
                className="h-56 w-56 sm:h-64 sm:w-64 object-contain rounded-xl select-none"
              />
            ) : (
              <div className="h-56 w-56 sm:h-64 sm:w-64 flex items-center justify-center bg-[#F9FBFA] rounded-xl text-xs text-muted-foreground">
                Generating QR...
              </div>
            )}

            {/* Turnstile Gate Tag */}
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent/60 px-3 py-1 text-[11px] font-extrabold text-primary border border-primary/20">
              <QrCode className="h-3 w-3" />
              <span>Turnstile Gate 01 • Live Check-In</span>
            </div>
          </div>

          <div className="mt-3.5 flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Encodes: <code className="font-mono text-foreground font-bold">{gateCode}</code></span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-primary hover:underline inline-flex items-center gap-1 cursor-pointer ml-1"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-2 pt-2 border-t border-border/70">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer shadow-xs"
          >
            <Printer className="h-4 w-4 stroke-[2.2]" />
            <span>Print Front-Desk Standee</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-[#F5F8F6] hover:text-foreground transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
