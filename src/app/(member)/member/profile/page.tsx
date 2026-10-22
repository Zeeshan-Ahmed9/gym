import * as React from "react";
import { getMemberDashboardData } from "@/server/services/member-dashboard.service";
import { getGymSettings } from "@/server/services/settings.service";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "My Profile | FitFlow",
  description: "View your personal profile details, membership pass, and facility contact.",
};

export default async function MemberProfilePage() {
  const [data, settings] = await Promise.all([
    getMemberDashboardData(),
    getGymSettings(),
  ]);

  if (!data) {
    return (
      <div className="py-12 text-center text-sm text-[#718078]">
        No member profile found.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <Link
          href="/member"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-2 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#14211D]">
          Member Profile & Pass
        </h1>
        <p className="text-sm text-[#718078] font-medium mt-0.5">
          Account details and active gym membership registration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Personal Details */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary font-extrabold text-base">
              {data.member.initials}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#14211D]">
                {data.member.name}
              </h2>
              <span className="font-mono text-xs text-[#718078]">
                {data.member.memberCode}
              </span>
            </div>
          </div>

          <div className="divide-y divide-border/60 text-xs">
            <div className="py-3 flex items-center justify-between">
              <span className="text-[#718078] flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" /> Phone Number
              </span>
              <span className="font-bold text-[#14211D]">{data.member.phone || "—"}</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-[#718078] flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" /> Email Address
              </span>
              <span className="font-bold text-[#14211D]">{data.member.email || "—"}</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-[#718078] flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" /> Account Status
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-success border border-success/20">
                <CheckCircle2 className="h-3 w-3" />
                Verified Active
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Membership Details */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <CreditCard className="h-4 w-4" />
              <span>Membership Subscription</span>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                data.membership.status === "ACTIVE"
                  ? "bg-accent text-success border border-success/20"
                  : "bg-[#FDF2F2] text-danger border border-danger/20"
              }`}
            >
              {data.membership.status}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-[#14211D]">
              {data.membership.planName}
            </h3>
            <p className="text-2xl font-extrabold text-primary">
              Rs. {data.membership.monthlyFee.toLocaleString()}{" "}
              <span className="text-xs font-medium text-[#718078]">/month</span>
            </p>
          </div>

          <div className="divide-y divide-border/60 text-xs">
            <div className="py-3 flex items-center justify-between">
              <span className="text-[#718078] flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" /> Valid Till
              </span>
              <span className="font-bold text-[#14211D]">
                {data.membership.expiryDate}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-[#718078] flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" /> Fee Status
              </span>
              <span
                className={`font-bold ${
                  data.membership.feeStatus === "PAID" ? "text-success" : "text-warning"
                }`}
              >
                {data.membership.feeStatus === "PAID" ? "Paid for this month" : `Due: Rs. ${data.membership.duesAmount}`}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Gym Facility Information */}
        <div className="md:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
            <Building className="h-4 w-4" />
            <span>Facility Desk & Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#718078] block mb-0.5">Facility Name</span>
              <span className="font-bold text-[#14211D]">{settings.gymName}</span>
            </div>

            <div>
              <span className="text-[#718078] block mb-0.5">Contact Desk</span>
              <span className="font-bold text-[#14211D]">{settings.phone}</span>
            </div>

            <div>
              <span className="text-[#718078] block mb-0.5">Address</span>
              <span className="font-bold text-[#14211D]">{settings.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
