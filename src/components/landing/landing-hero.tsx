"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { YoutubeIcon, FacebookIcon, InstagramIcon } from "./social-icons";

export function LandingHero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-[#060709] text-white pt-24 sm:pt-28 pb-12 flex flex-col justify-between"
    >
      {/* Background Lighting & Radial Glows (matching sample aesthetic) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Subtle dark vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,rgba(34,197,94,0.06),transparent_70%)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-gradient-to-b from-[#22C55E]/10 to-transparent blur-3xl opacity-40" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-between">
        {/* Top: Huge Bold Centered Headline (Matching media_1792796374828.png) */}
        <div className="text-center pt-2 sm:pt-4 select-none">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white leading-[1.02]">
            Reach Your Best
            <br />
            Shape For Life
          </h1>
        </div>

        {/* Center Section: Hero Athlete + Left Social/Review Stack + Right Text & Be a Member Button */}
        <div className="relative mt-2 sm:mt-0 flex-1 flex flex-col md:flex-row items-end justify-between min-h-[500px] sm:min-h-[580px]">
          {/* Left Column: Vertical Socials (YouTube, Facebook, Instagram + Line) & 1.2k Happy Clients */}
          <div className="w-full md:w-1/3 flex flex-col justify-end items-start order-2 md:order-1 z-20 pb-6 sm:pb-8 pl-1 sm:pl-4 space-y-6">
            {/* Vertical Social Icons: YouTube, Facebook, Instagram, followed by a vertical line */}
            <div className="flex flex-col items-center gap-4 text-white/70">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#22C55E] transition-colors p-1"
                aria-label="YouTube"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#22C55E] transition-colors p-1"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#22C55E] transition-colors p-1"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              {/* Vertical line under social icons */}
              <div className="w-px h-12 bg-white/40 mt-1" />
            </div>

            {/* Avatars Stack + "1.2k Happy Clients" (Matching media_1792796374828.png) */}
            <div className="pt-2">
              <div className="flex -space-x-2.5 overflow-hidden pb-2">
                <div className="relative inline-block h-9 w-9 rounded-full ring-2 ring-[#22C55E] overflow-hidden bg-zinc-800 shadow-md">
                  <Image
                    src="/images/transform-michael.jpg"
                    alt="IronMan Fitness Member"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative inline-block h-9 w-9 rounded-full ring-2 ring-[#22C55E] overflow-hidden bg-zinc-800 shadow-md">
                  <Image
                    src="/images/transform-adam.jpg"
                    alt="IronMan Fitness Member"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative inline-block h-9 w-9 rounded-full ring-2 ring-[#22C55E] overflow-hidden bg-zinc-800 shadow-md">
                  <Image
                    src="/images/coach-haisam.jpg"
                    alt="IronMan Fitness Member"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  1.2k
                </span>
                <span className="text-xs sm:text-sm font-medium text-white/80">
                  Happy Clients
                </span>
              </div>
            </div>
          </div>

          {/* Center Column: The Exact Athlete Photo Provided by User */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[340px] h-[480px] sm:w-[440px] sm:h-[620px] md:w-[500px] md:h-[680px] flex items-end justify-center pointer-events-none z-10">
            <Image
              src="/images/hero-athlete.png"
              alt="IronMan Fitness Athlete"
              fill
              priority
              sizes="(max-width: 768px) 340px, (max-width: 1200px) 480px, 540px"
              className="object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
            />
            {/* Subtle bottom fade to blend with pitch-black page transition */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#060709] to-transparent pointer-events-none" />
          </div>

          {/* Right Column: Subtitle Text & "Be a Member" Green Pill Button */}
          <div className="w-full md:w-1/3 flex flex-col justify-end items-start md:items-end text-left md:text-right order-3 z-20 pb-6 sm:pb-8 pr-1 sm:pr-4 space-y-6">
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-[270px] font-normal">
              Get stronger, leaner, and more energized with custom fitness and nutrition coaching that fits your lifestyle
            </p>

            {/* Bright Solid Green Pill Button: "Be a Member" (Replacing sample's Book a class as requested) */}
            <Link
              id="hero-be-a-member-btn"
              href="/member/login"
              className="inline-flex items-center justify-center rounded-full bg-[#22C55E] hover:bg-[#16A34A] px-8 py-3.5 text-xs sm:text-sm font-extrabold text-black shadow-lg shadow-[#22C55E]/30 hover:shadow-xl hover:shadow-[#22C55E]/40 hover:scale-[1.03] active:scale-[0.98] transition-all uppercase tracking-wider cursor-pointer"
            >
              <span>Be a Member</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
