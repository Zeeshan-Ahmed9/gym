"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, CheckCircle2 } from "lucide-react";

export function LandingCoach() {
  const credentials = [
    "Certified Strength & Conditioning Specialist",
    "Precision Nutrition & Body Recomposition",
    "12+ Years Professional Fitness Mentorship",
    "500+ Documented Client Transformations",
  ];

  return (
    <section id="coach" className="relative bg-[#FFFFFF] py-20 sm:py-28 overflow-hidden">
      {/* Soft mint aura on right */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-[#E5F6EF] blur-3xl opacity-70" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Coach Photo in Dark Modern Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-[#111714] border-2 border-[#1E2E25] shadow-2xl p-2 group">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/coach-haisam.jpg"
                  alt="Coach Haisam - Head Personal Trainer at IronMan Fitness"
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 p-3 flex items-center justify-between text-white">
                  <div>
                    <h4 className="text-sm font-bold tracking-tight">Coach Haisam</h4>
                    <p className="text-[11px] text-[#00E5AA] font-semibold">Head Strength Coach • IronMan Fitness</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00A878] text-white">
                    <Award className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Coach Bio & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#00A878] bg-[#E5F6EF] px-3 py-1 rounded-full border border-[#00A878]/20 inline-block">
                EXPERT COACHING
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17221D] leading-[1.12]">
                Hi, I’m Haisam
                <br />
                <span className="text-[#00A878]">Your Personal Coach</span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#66736C] leading-relaxed max-w-xl font-normal">
              Whether your objective is to shed stubborn body fat, build dense lean muscle, or develop relentless everyday stamina, I provide the exact roadmap, progressive split, and direct accountability you need to succeed. At IronMan Fitness, we treat your goals like our own.
            </p>

            {/* Credentials Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {credentials.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#17221D]">
                  <CheckCircle2 className="h-4 w-4 text-[#00A878] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Button: "Be a Member" */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                id="coach-be-a-member-btn"
                href="/member/login"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00A878] to-[#00E5AA] hover:from-[#008F65] hover:to-[#00D06C] px-8 py-3.5 text-xs sm:text-sm font-bold text-[#0A0D0C] shadow-md shadow-[#00A878]/25 hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer group"
              >
                <span>Be a Member</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </Link>

              <span className="text-xs text-[#66736C]">
                Includes digital turnstile entry pass & workout tracking
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
