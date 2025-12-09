"use client";

import { useState, useEffect, useCallback } from "react";
import PhoneMockup from "./(components)/PhoneMockup";
import LeadForm from "./(components)/LeadForm";

type FunnelState = "hero" | "persona" | "form" | "success" | "error";

const PERSONAS = [
  { key: "A", label: "I'm underpaid where I am", emoji: "💸" },
  { key: "B", label: "I'm actively job hunting", emoji: "🎯" },
  { key: "C", label: "I've been laid off", emoji: "🔄" },
  { key: "D", label: "Just exploring options", emoji: "👀" },
  { key: "E", label: "I hire for roles", emoji: "🤝" },
];

const COMPANIES = [
  "Google", "Microsoft", "Amazon", "Flipkart", "Swiggy",
  "CRED", "Razorpay", "Zerodha", "PhonePe", "Meesho",
  "Atlassian", "Uber", "Ola", "Paytm",
];

const PERSONA_MESSAGES: Record<string, string> = {
  "I'm underpaid where I am": "i'll help you find roles that actually pay what you're worth",
  "I'm actively job hunting": "perfect timing — let's speed up your search",
  "I've been laid off": "been there. let's get you back on track fast",
  "Just exploring options": "smart move. i'll show you what's out there",
  "I hire for roles": "great! i can connect you with top talent too",
};

export default function Home() {
  const [state, setState] = useState<FunnelState>("hero");
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [phoneExpanded, setPhoneExpanded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 50 && state === "hero") {
        setPhoneExpanded(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [state]);

  // Handle scroll/interaction to expand
  const handleInteraction = useCallback(() => {
    if (state === "hero") {
      setPhoneExpanded(true);
      setTimeout(() => setState("persona"), 300);
    }
  }, [state]);

  // Handle wheel event for initial interaction
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && state === "hero") {
        handleInteraction();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [state, handleInteraction]);

  const handlePersonaSelect = (persona: string) => {
    setSelectedPersona(persona);
    setTimeout(() => setState("form"), 800);
  };

  const resetToStart = () => {
    setState("hero");
    setSelectedPersona(null);
    setPhoneExpanded(false);
  };

  return (
    <div className="min-h-screen gradient-bg overflow-x-hidden">
      {/* Decorative circles */}
      <div className="circle-decoration w-[600px] h-[600px] -top-[200px] -right-[200px] fixed opacity-50" />
      <div className="circle-decoration w-[400px] h-[400px] top-[50%] -left-[150px] fixed opacity-30" />

      {/* Main container */}
      <div className="relative min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={resetToStart}
              className="flex items-center gap-2 text-white font-bold text-xl hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                T
              </div>
              <span>Tal</span>
            </button>

            {state !== "hero" && state !== "success" && (
              <button
                onClick={resetToStart}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Start over
              </button>
            )}
          </div>
        </nav>

        {/* Hero State */}
        {(state === "hero" || state === "persona") && (
          <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-10">
            <div
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-w-6xl mx-auto transition-all duration-700 ${
                state === "persona" ? "lg:items-start" : ""
              }`}
            >
              {/* Phone mockup */}
              <div
                className={`relative transition-all duration-700 ${
                  state === "persona" ? "lg:order-2" : ""
                }`}
                style={{
                  transform: `translateY(${Math.min(scrollY * 0.1, 30)}px)`,
                }}
              >
                <PhoneMockup
                  expanded={phoneExpanded}
                  selectedPersona={selectedPersona}
                  className="animate-float"
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left max-w-xl">
                {state === "hero" && (
                  <div className="animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                      Hey, I&apos;m{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                        Tal
                      </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 mb-4">
                      Your job-fixing agent on WhatsApp
                    </p>
                    <p className="text-base md:text-lg text-white/50 mb-8">
                      I send you 1 serious, relevant job a day. No spam, no job board nonsense.
                    </p>

                    <button
                      onClick={handleInteraction}
                      className="btn-primary px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center gap-3 animate-glow"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Message Tal
                    </button>

                    <p className="mt-6 text-sm text-white/40">
                      Scroll down or click to continue
                    </p>
                  </div>
                )}

                {state === "persona" && (
                  <div className="animate-slide-up">
                    <p className="text-white/60 text-sm mb-4 uppercase tracking-wider">
                      Tell me about yourself
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">
                      What brings you here?
                    </h2>

                    <div className="space-y-3">
                      {PERSONAS.map((persona, index) => (
                        <button
                          key={persona.key}
                          onClick={() => handlePersonaSelect(persona.label)}
                          className={`option-btn w-full text-left rounded-2xl px-5 py-4 flex items-center gap-4 opacity-0 animate-fade-in-up ${
                            selectedPersona === persona.label ? "selected" : ""
                          }`}
                          style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
                        >
                          <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white/60">
                            {persona.key}
                          </span>
                          <span className="flex-1 text-sm md:text-base">{persona.label}</span>
                          <span className="text-lg">{persona.emoji}</span>
                        </button>
                      ))}
                    </div>

                    {selectedPersona && (
                      <div className="mt-6 p-4 rounded-2xl glass animate-fade-in-up">
                        <p className="text-white/80 text-sm">
                          <span className="text-orange-400">Tal:</span>{" "}
                          {PERSONA_MESSAGES[selectedPersona]}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        )}

        {/* Form State */}
        {state === "form" && (
          <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-10">
            <div className="w-full max-w-xl animate-scale-in">
              <div className="glass-strong rounded-3xl p-6 md:p-8">
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-400 text-sm mb-4">
                    <span>✨</span>
                    <span>{selectedPersona}</span>
                  </div>
                </div>

                <LeadForm
                  selectedPersona={selectedPersona || ""}
                  onSuccess={() => setState("success")}
                  onError={() => setState("error")}
                  onBack={() => setState("persona")}
                />
              </div>
            </div>
          </main>
        )}

        {/* Success State */}
        {state === "success" && (
          <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-10">
            <div className="text-center max-w-lg animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                You&apos;re in! 🎉
              </h2>
              <p className="text-white/60 text-lg mb-2">
                I&apos;ll text you on WhatsApp shortly
              </p>
              <p className="text-white/40 text-sm mb-8">
                Expect your first job within 24 hours. If you don&apos;t hear from me,
                check that your number is correct or email{" "}
                <a href="mailto:hey@taljobs.in" className="text-orange-400 hover:underline">
                  hey@taljobs.in
                </a>
              </p>

              <button
                onClick={resetToStart}
                className="px-6 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                Back to home
              </button>
            </div>
          </main>
        )}

        {/* Error State */}
        {state === "error" && (
          <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-10">
            <div className="text-center max-w-lg animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Oops! Something broke
              </h2>
              <p className="text-white/60 mb-8">
                Please try again. If it keeps failing, email us at{" "}
                <a href="mailto:hey@taljobs.in" className="text-orange-400 hover:underline">
                  hey@taljobs.in
                </a>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setState("form")}
                  className="btn-primary px-6 py-3 rounded-xl text-sm font-semibold text-white"
                >
                  Try again
                </button>
                <button
                  onClick={resetToStart}
                  className="px-6 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  Start over
                </button>
              </div>
            </div>
          </main>
        )}

        {/* Logo Strip - Show on hero/persona states */}
        {(state === "hero" || state === "persona") && (
          <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm text-white/40 mb-6 uppercase tracking-wider">
                Tal users work at
              </p>
              <div className="logo-strip overflow-hidden">
                <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6">
                  {COMPANIES.map((company) => (
                    <div
                      key={company}
                      className="px-4 py-2 rounded-lg bg-white/5 text-white/50 text-sm font-medium"
                    >
                      {company}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-6 px-4 border-t border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <span>© 2025 Watercooler Chat Pvt. Ltd.</span>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
