import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | FitFlow",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F8F6] p-6 sm:p-12 text-[#14211D]">
      <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 shadow-xs space-y-4">
        <Link
          href="/member"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Member Dashboard</span>
        </Link>
        <div className="flex items-center gap-2 text-primary">
          <Lock className="h-6 w-6" />
          <h1 className="text-2xl font-extrabold text-[#14211D]">Privacy Policy</h1>
        </div>
        <p className="text-xs text-[#718078] leading-relaxed">
          Your personal details, attendance records, and body metrics are strictly private to your member account.
          FitFlow adheres to strict data security standards and never shares member personal data with third parties.
        </p>
      </div>
    </div>
  );
}
