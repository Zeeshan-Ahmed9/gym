import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";

export const metadata = {
  title: "Add Member",
  description: "Register a new gym member",
};

export default function NewMemberPlaceholderPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/members"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Back to Members"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Add New Member
          </h1>
          <p className="text-xs text-muted-foreground">
            Register a new client or trainee
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pale-mint border border-primary/20 text-primary shadow-xs">
          <UserPlus className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          Member Registration Form
        </h3>
        <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
          The member onboarding form is scheduled for the next phase. Return to the members roster to manage existing accounts.
        </p>
        <div className="mt-6">
          <Link
            href="/admin/members"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Members</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
