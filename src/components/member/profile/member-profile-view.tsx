"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Edit3, QrCode } from "lucide-react";
import type { MemberDashboardData } from "@/types/member-dashboard";
import { MemberDigitalPass } from "./member-digital-pass";
import { PersonalInfoCard } from "./personal-info-card";
import { MembershipStatusCard } from "./membership-status-card";
import { GymPrivilegesCard } from "./gym-privileges-card";
import { EditProfileModal } from "./edit-profile-modal";
import { QrScannerModal } from "@/components/member/qr-scanner-modal";

interface MemberProfileViewProps {
  initialData: MemberDashboardData;
  gymSettings: {
    gymName: string;
    phone: string;
    address: string;
  };
}

export function MemberProfileView({ initialData, gymSettings }: MemberProfileViewProps) {
  const router = useRouter();
  const [member, setMember] = React.useState(initialData.member);
  const [membership] = React.useState(initialData.membership);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);

  const handleProfileUpdated = (updated: { name: string; phone: string; email: string }) => {
    setMember((prev) => {
      const parts = updated.name.trim().split(/\s+/).filter(Boolean);
      const initials = parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : updated.name.slice(0, 2).toUpperCase();

      return {
        ...prev,
        name: updated.name,
        firstName: parts[0] || updated.name,
        initials,
        phone: updated.phone,
        email: updated.email,
      };
    });
    router.refresh();
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          {/* Club Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/80 border border-primary/25 px-3 py-1 text-xs font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span>{gymSettings.gymName || "Downtown Flagship Club"}</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#14211D]">
            My Profile
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#718078] font-medium">
            Personal account information, digital membership pass, and subscription status.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            id="member-edit-profile-btn"
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-[#14211D] shadow-xs hover:bg-[#F5F8F6] hover:border-[#BAC8BF] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5 text-[#718078]" />
            <span>Edit Profile</span>
          </button>

          <button
            id="member-scan-qr-btn"
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer"
          >
            <QrCode className="h-3.5 w-3.5 stroke-[2.2]" />
            <span>Scan QR</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: Digital Pass + Personal Details (7 cols) */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          <MemberDigitalPass
            member={member}
            membership={membership}
            gymName={gymSettings.gymName}
            onOpenScanner={() => setIsScannerOpen(true)}
          />

          <PersonalInfoCard
            member={member}
            onEditClick={() => setIsEditModalOpen(true)}
          />
        </div>

        {/* Right Column: Subscription Status + Privileges (5 cols) */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          <MembershipStatusCard membership={membership} />

          <GymPrivilegesCard
            gymName={gymSettings.gymName}
            gymPhone={gymSettings.phone}
            gymAddress={gymSettings.address}
          />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        member={member}
        onSuccess={handleProfileUpdated}
      />

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        memberId={member.id}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
