import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { siteConfig } from "@/config/site";

export interface NavbarProps {
  userRole?: "ADMIN" | "MEMBER";
}

export function Navbar({ userRole }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-foreground transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black">
            <Dumbbell className="h-5 w-5" />
          </div>
          <span className="text-base tracking-wider uppercase font-black">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {userRole && (
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {userRole}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
