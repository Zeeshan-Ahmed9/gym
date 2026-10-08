import type { DefaultSession } from "next-auth";
import type { UserRole } from "./index";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      memberId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role: UserRole;
    memberId?: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    memberId?: string | null;
  }
}
