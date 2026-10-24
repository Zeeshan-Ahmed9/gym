import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import { LandingTransformations } from "@/components/landing/landing-transformations";
import { LandingTestimonials } from "@/components/landing/landing-testimonials";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "IronMan Fitness | Reach Your Best Shape For Life",
  description:
    "Official website of IronMan Fitness. Elite physique engineering, structured coaching protocols, digital member pass, and turnstile check-in gym platform.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#060709] font-sans text-white selection:bg-[#22C55E] selection:text-black">
      {/* 1. Header / Navbar with Centered Links and Top-Right Admin Button */}
      <LandingNavbar />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* 2. Hero Section with User-Provided Athlete Image, 1.2k Happy Clients & Be a Member CTA */}
        <LandingHero />

        {/* 3. How It Works Section (Free Intake Call, Custom Plan card, Weekly Check-Ins) */}
        <LandingHowItWorks />

        {/* 4. Real People Real Transformations Carousel Section with Before/After */}
        <LandingTransformations />

        {/* 5. What Our Clients Say Testimonial Section */}
        <LandingTestimonials />

        {/* 6. Modern Frequently Asked Questions (FAQ) Section */}
        <LandingFaq />
      </main>

      {/* 7. Sleek Minimalist Footer with All Rights Reserved */}
      <LandingFooter />
    </div>
  );
}
