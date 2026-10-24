"use client";

import * as React from "react";
import {
  X,
  QrCode,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { recordQrCheckInAction } from "@/server/actions/member-dashboard.actions";

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  onSuccess: (data: { checkInTime: string; gate: string }) => void;
}

export function QrScannerModal({
  isOpen,
  onClose,
  memberId,
  onSuccess,
}: QrScannerModalProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const [hasCamera, setHasCamera] = React.useState<boolean | null>(null);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successInfo, setSuccessInfo] = React.useState<{ checkInTime: string; gate: string } | null>(null);

  const stopCamera = React.useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const handleClose = React.useCallback(() => {
    stopCamera();
    setSuccessInfo(null);
    setErrorMsg(null);
    onClose();
  }, [onClose, stopCamera]);

  // Initialize camera when modal opens
  React.useEffect(() => {
    if (!isOpen) return;

    let active = true;

    Promise.resolve().then(async () => {
      if (!active) return;
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCamera(false);
          setCameraError("Camera access is not supported by your browser.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setHasCamera(true);
      } catch {
        if (!active) return;
        setHasCamera(false);
        setCameraError("Camera permission denied or camera not found on this device.");
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      active = false;
      stopCamera();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose, stopCamera]);

  const handleVerifyCheckIn = async (code: string) => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const res = await recordQrCheckInAction(memberId, code);
      if (res.success && res.data) {
        setSuccessInfo(res.data);
        stopCamera();
        setTimeout(() => {
          onSuccess(res.data!);
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res.error || "Turnstile entry could not be verified.");
      }
    } catch {
      setErrorMsg("An unexpected network error occurred while verifying QR code.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#17221D]/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-6 text-foreground shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 rounded-full border border-border bg-card p-2 text-[#718078] hover:bg-[#F5F8F6] hover:text-foreground transition-all cursor-pointer"
          aria-label="Close scanner"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="pr-10 pb-4 border-b border-border">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-primary mb-2">
            <QrCode className="h-3.5 w-3.5" />
            <span>Turnstile Check-in</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Scan Turnstile QR
          </h2>
          <p className="mt-1 text-xs text-[#718078]">
            Point your camera at the front desk or turnstile gate QR code.
          </p>
        </div>

        {/* Scanner Viewport */}
        <div className="my-5">
          {successInfo ? (
            /* Success confirmation view */
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl bg-accent border border-primary/25 space-y-3 animate-in zoom-in-90 duration-200">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-md">
                <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Turnstile Verified!
              </h3>
              <p className="text-xs text-foreground font-medium">
                Entry recorded at <span className="font-semibold">{successInfo.checkInTime}</span> via{" "}
                <span className="font-semibold">{successInfo.gate}</span>.
              </p>
              <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Have a great workout!
              </span>
            </div>
          ) : (
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black flex items-center justify-center border border-border shadow-inner">
              {/* Camera Video Stream */}
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                playsInline
                muted
              />

              {/* Laser Scanning Animation Frame */}
              <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-primary/80 flex items-center justify-center">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse shadow-[0_0_8px_#00B386]" />
                <div className="h-10 w-10 border-t-2 border-l-2 border-primary absolute top-0 left-0 rounded-tl" />
                <div className="h-10 w-10 border-t-2 border-r-2 border-primary absolute top-0 right-0 rounded-tr" />
                <div className="h-10 w-10 border-b-2 border-l-2 border-primary absolute bottom-0 left-0 rounded-bl" />
                <div className="h-10 w-10 border-b-2 border-r-2 border-primary absolute bottom-0 right-0 rounded-br" />
              </div>

              {/* Fallback if camera is off or denied */}
              {hasCamera === false && (
                <div className="absolute inset-0 bg-[#17221D]/90 p-6 flex flex-col items-center justify-center text-center text-white space-y-2">
                  <Camera className="h-10 w-10 text-muted-foreground mb-1" />
                  <p className="text-xs font-semibold text-white/90">
                    {cameraError || "Camera feed is inactive."}
                  </p>
                  <p className="text-[11px] text-white/60">
                    You can still simulate a turnstile scan using the quick button below.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#FDF2F2] border border-danger/25 p-3 text-xs text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2.5">
          {/* Quick Simulation Button (works regardless of camera hardware) */}
          <button
            type="button"
            onClick={() => handleVerifyCheckIn("FITFLOW-TURNSTILE-GATE01")}
            disabled={isProcessing || !!successInfo}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying Check-in...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 stroke-[2.5]" />
                <span>Simulate Turnstile Gate 01 Scan</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-[#718078] hover:bg-[#F5F8F6] hover:text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
