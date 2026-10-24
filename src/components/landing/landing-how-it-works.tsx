"use client";

import * as React from "react";
import { PhoneCall, ClipboardCheck, CalendarCheck } from "lucide-react";

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-white py-24 sm:py-32 text-zinc-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Category Label, Heading & Description (Matching media_1792796386828.png) */}
          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-900">
              HOW IT WORKS
            </p>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 leading-[1.12]">
              Your Path to a
              <br />
              Stronger, Healthier
              <br />
              You – Simplified
            </h2>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-md font-normal pt-2">
              We make fitness fit your life. Just follow these 3 simple steps to start transforming your body and habits — for good.
            </p>
          </div>

          {/* Right Column: 3 Vertical Progression Items (Matching media_1792796386828.png) */}
          <div className="space-y-6 sm:space-y-8">
            {/* Step 1: Free Intake Call */}
            <div className="flex items-center gap-5 sm:gap-6 pl-2">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center text-[#2563EB]">
                <PhoneCall className="h-7 w-7 sm:h-8 sm:w-8 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
                  Free Intake Call
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  Get to know your goals, challenges, and lifestyle.
                </p>
              </div>
            </div>

            {/* Step 2: Custom Plan (Featured Dark Floating Card) */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#090D0C] p-6 sm:p-7 text-white shadow-2xl shadow-zinc-950/20 border border-zinc-900 transition-transform hover:-translate-y-0.5 duration-200">
              <div className="flex items-center gap-5 sm:gap-6">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center text-[#22C55E]">
                  <ClipboardCheck className="h-8 w-8 sm:h-9 sm:w-9 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#22C55E] tracking-tight">
                    Custom Plan
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
                    Receive a personalized training & nutrition strategy built just for you.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Weekly Check-Ins */}
            <div className="flex items-center gap-5 sm:gap-6 pl-2">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center text-[#2563EB]">
                <CalendarCheck className="h-7 w-7 sm:h-8 sm:w-8 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
                  Weekly Check-Ins
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  Stay on track with support, adjustments, and accountability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
