import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

export const metadata = {
  title: "Member Profile",
  description: "View gym member details",
};

interface MemberDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemberDetailsPlaceholderPage({
  params,
}: MemberDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/members"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-[#15191D] text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to Members"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Member Profile
          </h1>
          <p className="text-xs text-muted-foreground">
            Identifier: <span className="font-mono text-primary">{id}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-[#15191D]/60 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border text-primary shadow-sm">
          <User className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-bold text-foreground">
          Member Profile Details
        </h3>
        <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
          The comprehensive member profile view with workout logs, fees, and pass QR codes is scheduled for the next phase.
        </p>
        <div className="mt-6">
          <Link
            href="/admin/members"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Members</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
