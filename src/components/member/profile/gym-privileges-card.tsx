"use client";

import * as React from "react";
import { Dumbbell, QrCode, Sparkles, ShowerHead, Activity, PhoneCall, MapPin } from "lucide-react";

interface GymPrivilegesCardProps {
  gymName?: string;
  gymPhone?: string;
  gymAddress?: string;
}

export function GymPrivilegesCard({
  gymName = "Downtown Flagship Club",
  gymPhone = "+92 300 1234567",
  gymAddress = "Main Korangi 6 road, Karachi",
}: GymPrivilegesCardProps) {
  const privileges = [
    {
      icon: Dumbbell,
      title: "Full Floor Access",
      desc: "Weight hall & cardio zone (6:00 AM – 11:00 PM)",
    },
    {
      icon: QrCode,
      title: "QR Turnstile Entry",
      desc: "Fast contactless access via mobile digital pass",
    },
    {
      icon: ShowerHead,
      title: "Locker & Amenities",
      desc: "Complimentary changing lockers & shower facilities",
    },
    {
      icon: Activity,
      title: "Progress & Metrics",
      desc: "Unlimited attendance history and body tracking",
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-5 hover:border-[#BAC8BF] transition-all">
      {/* Header Row */}
      <div className="flex items-center gap-2.5 border-b border-border/80 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-primary shadow-2xs">
          <Sparkles className="h-4 w-4 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-[#14211D]">
            Membership Privileges
          </h3>
          <p className="text-xs text-[#718078] font-medium">
            Included features and facility access with your active tier
          </p>
        </div>
      </div>

      {/* Privileges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {privileges.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-2xl bg-[#F9FBFA] border border-border/70 p-3.5 hover:border-[#BAC8BF] transition-colors"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-[#14211D]">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#718078] leading-tight">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Facility Contact Footer Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl bg-[#F5F8F6] border border-border/80 px-4 py-3 text-xs text-[#718078]">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="font-medium">
            <strong className="text-[#14211D]">{gymName}</strong> • {gymAddress}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-primary font-bold self-start sm:self-auto">
          <PhoneCall className="h-3.5 w-3.5" />
          <span>{gymPhone}</span>
        </div>
      </div>
    </div>
  );
}
