import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Protect all routes except static assets, images, and standard metadata files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
