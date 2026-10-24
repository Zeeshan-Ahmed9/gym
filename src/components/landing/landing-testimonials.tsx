"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export function LandingTestimonials() {
  const [current, setCurrent] = React.useState(0);

  const testimonials = [
    {
      id: 1,
      quote:
        "I've tried countless programs, but nothing ever felt sustainable. With IronMan Fitness, everything clicked. I feel stronger, healthier, and more confident than I have in years!",
      author: "Emma R.",
      role: "Member for 14 Months",
      stars: 5,
      achievement: "Lost 12kg & Built Core Strength",
    },
    {
      id: 2,
      quote:
        "The turnstile check-in, the digital portal tracking, and Coach Haisam's direct guidance make this the most professional gym experience in the city. You actually want to show up every day.",
      author: "Zeeshan A.",
      role: "Elite Tier Member",
      stars: 5,
      achievement: "Consistently Active 5 Days/Week",
    },
    {
      id: 3,
      quote:
        "Down 18 kilograms in 5 months. No starvation diets, just progressive training and proper nutrition. The coaches here genuinely care about your long-term success.",
      author: "Hamza K.",
      role: "Transformation Graduate",
      stars: 5,
      achievement: "Full Body Recomposition",
    },
  ];

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const t = testimonials[current];

  return (
    <section id="testimonials" className="relative bg-[#070808] py-24 sm:py-32 text-white overflow-hidden">
      {/* Background Lighting & Gym Texture */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#00E5AA]/10 blur-3xl opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Header */}
        <div className="space-y-2 mb-10 sm:mb-14">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#00E5AA] bg-[#00E5AA]/10 px-3 py-1 rounded-full border border-[#00E5AA]/20 inline-block">
            TESTIMONIALS
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            What Our Clients Say
          </h2>

          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto font-normal">
            Over a thousand active members achieving their peak physical condition.
          </p>
        </div>

        {/* Central Quote Card (Matching sample screenshot layout) */}
        <div className="relative flex items-center justify-between gap-4 sm:gap-8">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00E5AA] hover:bg-[#00D06C] text-[#0A0D0C] shadow-lg shadow-[#00E5AA]/25 active:scale-95 transition-all cursor-pointer"
            aria-label="Previous review"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
          </button>

          {/* Testimonial Quote Display */}
          <div className="flex-1 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            {/* Big Lime Quote Marks */}
            <div className="flex justify-center text-[#00E5AA]">
              <Quote className="h-14 w-14 rotate-180 opacity-90 stroke-[1.8]" />
            </div>

            {/* Quote Text */}
            <p className="text-base sm:text-xl md:text-2xl font-normal text-white/95 leading-relaxed italic">
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Stars */}
            <div className="flex justify-center items-center gap-1.5 text-amber-400">
              {[...Array(t.stars)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>

            {/* Author Name & Details */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {t.author}
              </h3>
              <p className="text-xs text-[#00E5AA] font-semibold">
                {t.role} • {t.achievement}
              </p>
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00E5AA] hover:bg-[#00D06C] text-[#0A0D0C] shadow-lg shadow-[#00E5AA]/25 active:scale-95 transition-all cursor-pointer"
            aria-label="Next review"
          >
            <ChevronRight className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-10">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === current ? "w-8 bg-[#00E5AA]" : "w-2 bg-white/20"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
