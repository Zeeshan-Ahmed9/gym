"use client";

import * as React from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "faq-1",
    category: "Access & Timing",
    question: "What are the gym operating hours and turnstile check-in times?",
    answer:
      "IronMan Fitness is open Monday through Saturday from 6:00 AM to 11:00 PM, and Sundays from 8:00 AM to 8:00 PM. Active members have frictionless access throughout operating hours using their personal QR digital pass at the entrance turnstile.",
  },
  {
    id: "faq-2",
    category: "Digital Pass",
    question: "How does the Digital Member Pass and QR attendance work?",
    answer:
      "When you register, an encrypted dynamic QR code is generated inside your Member Portal on your phone. Simply flash your QR code at the front-desk scanner or turnstile kiosk to get verified and checked in within a second.",
  },
  {
    id: "faq-3",
    category: "Coaching & Plans",
    question: "Are customized workout routines and nutritional plans included?",
    answer:
      "Yes! Every member receives an intake fitness assessment followed by a structured workout split tailored to their specific muscle-building or fat-loss goals. Our coaches monitor your progressive overload and offer macro guidelines.",
  },
  {
    id: "faq-4",
    category: "Membership Policy",
    question: "Can I freeze or pause my membership if I travel or fall sick?",
    answer:
      "Absolutely. We offer a complimentary membership freeze of up to 30 days per calendar year. You can request a pause directly through your member portal or by speaking with the front desk team before traveling.",
  },
  {
    id: "faq-5",
    category: "Payments & Invoicing",
    question: "What payment methods are supported for fee renewals and packages?",
    answer:
      "We accept instant cash at the reception desk, debit/credit cards, and direct online bank transfers. Every payment is logged with an instant digital receipt available in your personal billing ledger.",
  },
];

export function LandingFaq() {
  const [openId, setOpenId] = React.useState<string | null>("faq-1");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="relative bg-[#060709] py-24 sm:py-32 text-white overflow-hidden">
      {/* Background radial neon ambiance */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[550px] rounded-full bg-[#00E5AA]/10 blur-[130px] opacity-40" />
        <div className="absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-[#00A878]/15 blur-3xl opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:28px_28px] opacity-50" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#00E5AA]/10 border border-[#00E5AA]/20 px-3.5 py-1 text-xs font-semibold text-[#00E5AA] tracking-wide uppercase">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-[#00E5AA] via-[#00A878] to-[#22C55E] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-white/60 leading-relaxed font-medium">
            Everything you need to know about our elite training facility, digital membership passes, coaching protocols, and membership policies.
          </p>
        </div>

        {/* Modern Interactive Accordion List */}
        <div className="space-y-3.5">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openId === item.id;
            const itemNumber = String(index + 1).padStart(2, "0");

            return (
              <div
                key={item.id}
                className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-[#0D1210]/95 border-[#00E5AA]/40 shadow-[0_0_28px_rgba(0,229,170,0.12)]"
                    : "bg-[#0A0D0C]/70 border-white/10 hover:border-white/20 hover:bg-[#0D1210]/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md transition-colors ${
                        isOpen
                          ? "bg-[#00E5AA] text-[#0A0D0C]"
                          : "bg-white/5 text-white/40 group-hover:text-white/70"
                      }`}
                    >
                      {itemNumber}
                    </span>
                    <span
                      className={`text-base sm:text-lg font-semibold tracking-tight transition-colors ${
                        isOpen ? "text-[#00E5AA]" : "text-white group-hover:text-white"
                      }`}
                    >
                      {item.question}
                    </span>
                  </div>

                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen
                        ? "bg-[#00E5AA] border-[#00E5AA] text-[#0A0D0C] rotate-180"
                        : "border-white/15 bg-white/5 text-white/60 group-hover:border-white/30 group-hover:text-white"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 text-sm sm:text-base text-white/70 leading-relaxed border-t border-white/5 animate-in fade-in-50 duration-200">
                    <p>{item.answer}</p>
                    <div className="mt-3.5 flex items-center gap-2 text-[11px] font-semibold text-[#00E5AA]/80 uppercase tracking-wider">
                      <Sparkles className="h-3 w-3" />
                      <span>Category: {item.category}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
