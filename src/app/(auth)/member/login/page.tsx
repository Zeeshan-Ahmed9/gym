import * as React from "react";
import { MemberLoginPortal } from "@/components/member/auth/member-login-portal";

export const metadata = {
  title: "Member Portal Sign In | FitFlow",
  description: "Verify your Gym ID to activate your account or sign in to the FitFlow member portal.",
};

export default function MemberLoginPage() {
  return <MemberLoginPortal />;
}
