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

      // Protected Admin routes
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
          // Allow local developer preview in development if no user session exists yet
          return process.env.NODE_ENV === "development";
        }
        // Strict role check: Members can NEVER access admin pages
        return userRole === "ADMIN";
      }

      // Protected Member routes
      if (pathname.startsWith("/member")) {
        if (!isLoggedIn) {
          return process.env.NODE_ENV === "development";
        }
        return userRole === "MEMBER" || userRole === "ADMIN";
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
