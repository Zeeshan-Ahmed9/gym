"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function LandingTransformations() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const transformations = [
    {
      id: "michael",
      name: "Michael Reed",
      badge: "Real Results – No Crash Diets",
      quote: "I dropped 10kg and finally feel confident in my own skin!",
      image: "/images/transform-michael.jpg",
    },
    {
      id: "adam",
      name: "Adam H.",
      badge: "Real Results – 18kg Fat Loss",
      quote: "I dropped 18kg and finally feel energized every single day!",
      image: "/images/transform-adam.jpg",
    },
    {
      id: "marcus",
      name: "Marcus Vance",
      badge: "Real Results – Muscle Hypertrophy",
      quote: "Gained 6kg lean mass and reached my all-time peak strength!",
      image: "/images/transform-marcus.jpg",
    },
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? transformations.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === transformations.length - 1 ? 0 : prev + 1));
  };

  const current = transformations[activeIndex];
  const prevItem = transformations[(activeIndex - 1 + transformations.length) % transformations.length];
  const nextItem = transformations[(activeIndex + 1) % transformations.length];

  return (
    <section id="transformations" className="relative bg-[#F8FAF9] py-24 sm:py-32 overflow-hidden">
      {/* Top-Right Background Watermark (Arm curling dumbbell matching media_1792796398828.png) */}
      <div className="pointer-events-none absolute top-4 right-6 sm:right-12 h-64 w-64 text-[#22C55E]/15 opacity-70">
        <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
          {/* Stylized bicep / dumbbell watermark */}
          <path d="M120 40c-15 0-25 10-35 25-10-8-25-12-40-5-18 8-25 28-20 45 4 15 18 25 35 25 10 0 20-5 25-12 12 18 28 27 45 27 25 0 45-20 45-50 0-30-25-55-55-55zm5 70c-15 0-25-10-25-25s10-25 25-25 25 10 25 25-10 25-25 25z" opacity="0.4" />
          <rect x="140" y="25" width="18" height="50" rx="6" opacity="0.5" />
          <rect x="70" y="15" width="22" height="65" rx="8" opacity="0.3" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header (Matching media_1792796398828.png) */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16 sm:mb-20">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-900">
            TRANSFORMATIONS
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 leading-[1.12]">
            Real People. Real
            <br />
            Transformations.
          </h2>

          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal pt-2">
            Our clients are busy professionals just like you — and they&apos;ve achieved real, lasting results through personalized coaching. Here&apos;s what&apos;s possible when you commit to the process.
          </p>
        </div>

        {/* Carousel Display: Center Main Card with Left & Right Peeks and Overlaid Green Arrow Buttons */}
        <div className="relative flex items-center justify-center max-w-5xl mx-auto">
          {/* Left Preview Card (Matching sample) */}
          <div className="hidden md:block w-72 shrink-0 rounded-3xl bg-white p-4 shadow-sm border border-zinc-100 opacity-40 scale-90 -mr-12 pointer-events-none select-none">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[1.12]">
              <Image
                src={prevItem.image}
                alt={prevItem.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="pt-3">
              <h4 className="text-base font-bold text-zinc-950">{prevItem.name}</h4>
              <p className="text-xs text-zinc-500 truncate mt-0.5">{prevItem.quote}</p>
            </div>
          </div>

          {/* Left Green Circle Arrow Button (Positioned over left seam) */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-8 md:left-24 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-black shadow-lg shadow-[#22C55E]/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Previous transformation"
          >
            <ChevronLeft className="h-6 w-6 stroke-[3]" />
          </button>

          {/* Active Center Card (Prominent, matching media_1792796398828.png) */}
          <div className="relative z-20 w-full max-w-sm sm:max-w-md rounded-3xl bg-white p-4 sm:p-5 shadow-2xl shadow-zinc-950/10 border border-zinc-100 transition-all">
            {/* Before / After Photo Container */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[1.12] sm:aspect-[1.15] shadow-inner">
              <Image
                src={current.image}
                alt={`${current.name} before and after transformation`}
                fill
                priority
                className="object-cover"
              />

              {/* Green Pill Badge on photo bottom (Matching sample screenshot) */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                <span className="inline-block rounded-full bg-black/85 border border-[#22C55E]/60 px-3.5 py-1 text-[11px] sm:text-xs font-semibold text-[#22C55E] shadow-md backdrop-blur-xs">
                  {current.badge}
                </span>
              </div>
            </div>

            {/* Client Name & Quote Below Photo */}
            <div className="pt-4 px-1">
              <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
                {current.name}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 leading-relaxed">
                {current.quote}
              </p>
            </div>
          </div>

          {/* Right Green Circle Arrow Button (Positioned over right seam) */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-8 md:right-24 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-black shadow-lg shadow-[#22C55E]/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Next transformation"
          >
            <ChevronRight className="h-6 w-6 stroke-[3]" />
          </button>

          {/* Right Preview Card (Matching sample) */}
          <div className="hidden md:block w-72 shrink-0 rounded-3xl bg-white p-4 shadow-sm border border-zinc-100 opacity-40 scale-90 -ml-12 pointer-events-none select-none">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[1.12]">
              <Image
                src={nextItem.image}
                alt={nextItem.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="pt-3">
              <h4 className="text-base font-bold text-zinc-950">{nextItem.name}</h4>
              <p className="text-xs text-zinc-500 truncate mt-0.5">{nextItem.quote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
