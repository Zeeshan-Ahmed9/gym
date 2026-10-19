"use client";

import * as React from "react";
import {
  Save,
  RotateCcw,
  CheckCircle2,
  X,
} from "lucide-react";
import type { GymSettings, GymSettingsFormErrors } from "@/types/settings";
import { GymProfileCard } from "./gym-profile-card";
import { MembershipDefaultsCard } from "./membership-defaults-card";
import { SettingsPreviewCard } from "./settings-preview-card";
import { SettingsGuidelinesCard } from "./settings-guidelines-card";
import { updateSettingsAction } from "@/server/actions/settings.actions";

interface SettingsViewProps {
  initialSettings: GymSettings;
}

export function SettingsView({ initialSettings }: SettingsViewProps) {
  // Current working form state
  const [settings, setSettings] = React.useState<GymSettings>(initialSettings);
  // Last saved state for rollback / dirty tracking
  const [savedSettings, setSavedSettings] = React.useState<GymSettings>(initialSettings);

  // Form errors
  const [errors, setErrors] = React.useState<GymSettingsFormErrors>({});

  // Loading & notification states
  const [isSaving, setIsSaving] = React.useState(false);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  // Compute dirty state
  const isDirty = React.useMemo(() => {
    return (
      settings.gymName !== savedSettings.gymName ||
      settings.gymLogo !== savedSettings.gymLogo ||
      settings.phone !== savedSettings.phone ||
      settings.email !== savedSettings.email ||
      settings.address !== savedSettings.address ||
      settings.defaultMonthlyFee !== savedSettings.defaultMonthlyFee ||
      settings.defaultMembershipDurationMonths !==
        savedSettings.defaultMembershipDurationMonths
    );
  }, [settings, savedSettings]);

  // Field change handler
  const handleFieldChange = <K extends keyof GymSettings>(
    field: K,
    value: GymSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));

    // Clear specific field error on typing
    if (errors[field as keyof GymSettingsFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Logo upload handler (generates local preview data URL)
  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSettings((prev) => ({ ...prev, gymLogo: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Logo remove handler
  const handleLogoRemove = () => {
    setSettings((prev) => ({ ...prev, gymLogo: null }));
  };

  // Form validation function
  const validateForm = (): boolean => {
    const newErrors: GymSettingsFormErrors = {};

    // 1. Gym Name
    if (!settings.gymName || !settings.gymName.trim()) {
      newErrors.gymName = "Gym Name cannot be empty.";
    }

    // 2. Phone Number
    if (!settings.phone || !settings.phone.trim()) {
      newErrors.phone = "Phone Number cannot be empty.";
    }

    // 3. Email Address (optional, but valid if provided)
    if (settings.email && settings.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(settings.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    // 4. Default Monthly Fee (must be > 0)
    const fee = Number(settings.defaultMonthlyFee);
    if (isNaN(fee) || fee <= 0) {
      newErrors.defaultMonthlyFee = "Default Monthly Fee must be greater than zero.";
    }

    // 5. Default Membership Duration (must be a positive whole number)
    const duration = Number(settings.defaultMembershipDurationMonths);
    if (isNaN(duration) || duration <= 0 || !Number.isInteger(duration)) {
      newErrors.defaultMembershipDurationMonths =
        "Default Membership Duration must be a positive whole number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save Settings handler
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateSettingsAction(settings);
      if (res.success && res.data) {
        setSavedSettings({ ...res.data });
        setSettings({ ...res.data });
        setSuccessToast("Settings saved successfully.");
      } else {
        setSuccessToast(null);
        alert(res.error || "Failed to save settings.");
      }
    } catch {
      alert("An unexpected error occurred while saving settings.");
    } finally {
      setIsSaving(false);
    }

    setTimeout(() => {
      setSuccessToast((current) =>
        current === "Settings saved successfully." ? null : current
      );
    }, 4000);
  };

  // Discard Changes handler
  const handleDiscard = () => {
    setSettings({ ...savedSettings });
    setErrors({});
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Success Toast */}
      {successToast && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-accent px-4 py-3 text-sm text-success animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            <span className="font-medium">{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="rounded-lg p-1 text-success/80 hover:text-success cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Gym Settings
        </h1>
        <p className="mt-1 text-sm text-secondary-foreground">
          Configure gym profile details and default membership fees.
        </p>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Gym Profile & Membership Defaults */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <GymProfileCard
            settings={settings}
            errors={errors}
            onChange={handleFieldChange}
            onLogoUpload={handleLogoUpload}
            onLogoRemove={handleLogoRemove}
          />

          <MembershipDefaultsCard
            settings={settings}
            errors={errors}
            onChange={handleFieldChange}
          />
        </div>

        {/* Right Column: Live Preview & Guidelines */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-6">
          <SettingsPreviewCard settings={settings} />
          <SettingsGuidelinesCard />
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-30 rounded-2xl border border-border bg-card p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs text-secondary-foreground">
          {isDirty ? (
            <>
              <span className="h-2 w-2 rounded-full bg-warning" />
              <span>You have unsaved changes.</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              <span>All changes are saved.</span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!isDirty || isSaving}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-semibold text-secondary-foreground hover:bg-[#F5F8F6] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Discard</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-xs cursor-pointer"
          >
            {isSaving ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Saving...</span>
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 stroke-[2.5]" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
