import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayoutShell } from "@/components/admin";

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

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
