import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayoutShell } from "@/components/admin";
import { getAdminPasscodeStatus } from "@/server/actions/admin-passcode.actions";
import { AdminPasscodeModal } from "@/components/admin/auth/admin-passcode-modal";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Defense-in-depth: strict role authorization in production
  if (process.env.NODE_ENV === "production") {
    if (!session?.user) {
      redirect("/login");
    }

    if (session.user.role !== "ADMIN") {
      redirect("/member");
    }
  }

  const { isConfigured, isUnlocked } = await getAdminPasscodeStatus();

  // If session is locked, enforce entering or creating passcode before opening admin panel
  if (!isUnlocked) {
    return (
      <div className="relative min-h-screen bg-[#060709] flex items-center justify-center p-4">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#00E5AA]/10 blur-[140px]" />
        </div>
        <AdminPasscodeModal
          isOpen={true}
          initialMode={isConfigured ? "enter" : "create"}
        />
      </div>
    );
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
