"use client";

import * as React from "react";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Upload,
  Trash2,
  Dumbbell,
  AlertCircle,
} from "lucide-react";
import type { GymSettings, GymSettingsFormErrors } from "@/types/settings";

interface GymProfileCardProps {
  settings: GymSettings;
  errors: GymSettingsFormErrors;
  onChange: <K extends keyof GymSettings>(field: K, value: GymSettings[K]) => void;
  onLogoUpload: (file: File) => void;
  onLogoRemove: () => void;
}

export function GymProfileCard({
  settings,
  errors,
  onChange,
  onLogoUpload,
  onLogoRemove,
}: GymProfileCardProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [logoUploadError, setLogoUploadError] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setLogoUploadError("File size exceeds 2MB limit. Please choose a smaller image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setLogoUploadError(null);
    onLogoUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
      {/* Card Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Gym Profile
          </h2>
          <p className="mt-0.5 text-sm text-secondary-foreground">
            General gym details and brand presence.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* 1. Gym Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="gym-name-input"
            className="block text-xs font-semibold text-secondary-foreground"
          >
            Gym Name <span className="text-danger">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-3.5 flex items-center text-muted-foreground">
              <Dumbbell className="h-4 w-4" />
            </div>
            <input
              id="gym-name-input"
              type="text"
              value={settings.gymName}
              onChange={(e) => onChange("gymName", e.target.value)}
              placeholder="e.g. IronPulse Gym"
              className={`flex h-11 w-full rounded-xl border bg-[#F5F8F6] pl-10 pr-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:bg-card focus:outline-none focus:ring-1 ${
                errors.gymName
                  ? "border-danger focus:border-danger focus:ring-danger"
                  : "border-border focus:border-primary focus:ring-primary"
              }`}
            />
          </div>
          {errors.gymName && (
            <p className="flex items-center gap-1 text-xs font-medium text-danger mt-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.gymName}</span>
            </p>
          )}
        </div>

        {/* 2. Gym Logo */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-secondary-foreground">
            Gym Logo <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-border bg-[#F5F8F6] p-4">
            {/* Logo Preview Window */}
            <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-xl border border-border bg-card overflow-hidden p-2 shadow-xs">
              {settings.gymLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.gymLogo}
                  alt="Gym Logo Preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <Dumbbell className="h-6 w-6 text-primary mb-1" />
                  <span className="text-[11px] font-semibold text-secondary-foreground">
                    Logo
                  </span>
                </div>
              )}
            </div>

            {/* Upload & Controls */}
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  Gym Insignia
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  Recommended: SVG or transparent PNG (max 2MB).
                </p>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-[#F5F8F6] hover:text-foreground transition-colors cursor-pointer shadow-xs"
                >
                  <Upload className="h-3.5 w-3.5 text-primary" />
                  <span>Change Logo</span>
                </button>

                {settings.gymLogo && (
                  <button
                    type="button"
                    onClick={() => {
                      setLogoUploadError(null);
                      onLogoRemove();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {logoUploadError && (
                <p className="text-xs font-medium text-danger mt-1">
                  {logoUploadError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 3. Contact Information */}
        <div className="pt-2 border-t border-border space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-primary" />
              <span>Contact Information</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Phone number, email, and location.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div className="space-y-1.5">
              <label
                htmlFor="phone-input"
                className="block text-xs font-semibold text-secondary-foreground"
              >
                Phone Number <span className="text-danger">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3.5 flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="phone-input"
                  type="text"
                  value={settings.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  placeholder="e.g. +92 300 9876543"
                  className={`flex h-11 w-full rounded-xl border bg-[#F5F8F6] pl-10 pr-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:bg-card focus:outline-none focus:ring-1 ${
                    errors.phone
                      ? "border-danger focus:border-danger focus:ring-danger"
                      : "border-border focus:border-primary focus:ring-primary"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="flex items-center gap-1 text-xs font-medium text-danger mt-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="email-input"
                className="block text-xs font-semibold text-secondary-foreground"
              >
                Email Address <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3.5 flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email-input"
                  type="email"
                  value={settings.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="e.g. admin@ironpulse.fit"
                  className={`flex h-11 w-full rounded-xl border bg-[#F5F8F6] pl-10 pr-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:bg-card focus:outline-none focus:ring-1 ${
                    errors.email
                      ? "border-danger focus:border-danger focus:ring-danger"
                      : "border-border focus:border-primary focus:ring-primary"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 text-xs font-medium text-danger mt-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* 4. Gym Physical Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="address-input"
              className="block text-xs font-semibold text-secondary-foreground"
            >
              Physical Address <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <input
                id="address-input"
                type="text"
                value={settings.address}
                onChange={(e) => onChange("address", e.target.value)}
                placeholder="e.g. Plot 42, Commercial Avenue, Phase 5"
                className="flex h-11 w-full rounded-xl border border-border bg-[#F5F8F6] pl-10 pr-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
