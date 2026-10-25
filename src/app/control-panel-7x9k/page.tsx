import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/server/auth/admin-session";
import { isAdminConfigured } from "@/server/services/admin-auth.service";
import { PrivateAdminLoginForm } from "@/components/admin/auth/private-admin-login-form";

export const metadata: Metadata = {
  title: "Admin Control Terminal | IronMan Fitness",
  description: "Private administrative authorization portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ControlPanelPage() {
  // If already authenticated via admin session cookie, go straight to admin panel
  const isAlreadyAuthenticated = await verifyAdminSession();
  if (isAlreadyAuthenticated) {
    redirect("/admin");
  }

  // Check if admin credentials have been configured in Neon
  const isConfigured = await isAdminConfigured();

  return <PrivateAdminLoginForm isConfigured={isConfigured} />;
}
