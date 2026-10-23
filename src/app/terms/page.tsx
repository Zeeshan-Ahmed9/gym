import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Terms of Service | FitFlow",
};

export default function TermsPage() {
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
          <ShieldCheck className="h-6 w-6" />
          <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
        </div>
        <p className="text-xs text-[#718078] leading-relaxed">
          Welcome to FitFlow Gym Management. By accessing your member account and using facility amenities,
          you agree to adhere to gym safety policies, check-in verification guidelines, and timely fee renewals.
        </p>
      </div>
    </div>
  );
}
