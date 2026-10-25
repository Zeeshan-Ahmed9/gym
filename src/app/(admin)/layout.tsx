import React from "react";
import { redirect } from "next/navigation";
import { AdminLayoutShell } from "@/components/admin";
import { verifyAdminSession } from "@/server/auth/admin-session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthorized = await verifyAdminSession();

  // Server-side authentication guard: enforce private admin session
  if (!isAuthorized) {
    redirect("/control-panel-7x9k");
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}

