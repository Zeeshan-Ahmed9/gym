import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/types";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role as UserRole | undefined;
      const pathname = nextUrl.pathname;

      // Admin routes & private login: protected directly via server-side session guard (Neon admin_credentials)
      if (pathname.startsWith("/admin") || pathname.startsWith("/control-panel-7x9k")) {
        return true;
      }

      // Public Member Login & Activation
      if (pathname.startsWith("/member/login")) {
        return true;
      }

      // Member routes & login: protected directly via server-side session guard (fitflow_member_session) in (member)/layout.tsx
      if (pathname.startsWith("/member")) {
        return true;
      }

      // If user is already logged in and navigates to login page
      if (pathname === "/login" && isLoggedIn) {
        if (userRole === "ADMIN") {
          return Response.redirect(new URL("/admin", nextUrl));
        }
        return Response.redirect(new URL("/member", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.memberId = user.memberId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.memberId = token.memberId as string | null | undefined;
      }
      return session;
    },
  },
  providers: [], // Initialized in auth.ts with Node runtime providers
} satisfies NextAuthConfig;
