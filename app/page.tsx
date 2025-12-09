"use client";

import { useState } from "react";
import ChatOnboarding from "./(components)/ChatOnboarding";
import LeadForm from "./(components)/LeadForm";

type FunnelState = "persona" | "interstitial" | "form" | "success" | "error";

const PERSONAS = [
  "I'm underpaid where I am",
  "I'm actively looking for a new job",
  "I've been laid off / between jobs",
  "I'm just exploring what's out there",
  "I hire / recruit for roles",
];

const COMPANIES = [
  "TCS",
  "CRED",
  "Swiggy",
  "Accenture",
  "Infosys",
  "HDFC Bank",
  "Flipkart",
  "Razorpay",
];

export default function Home() {
  const [state, setState] = useState<FunnelState>("persona");
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [chatPrefill, setChatPrefill] = useState<{
    name?: string;
    phone?: string;
    company?: string;
  } | null>(null);

  const handlePersonaSelect = (persona: string) => {
    setSelectedPersona(persona);
    setState("interstitial");
  };

  const handleChatComplete = (data: {
    name: string;
    phone: string;
    company: string;
  }) => {
    setChatPrefill(data);
  };

  const resetToStart = () => {
    setState("persona");
    setSelectedPersona(null);
    setChatPrefill(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <main className="flex-1 flex flex-col gap-6 px-4 py-8 max-w-3xl mx-auto w-full">
        {/* Hero Section - Always visible in persona state */}
        {state === "persona" && (
          <section className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            {/* Hero Text */}
            <div className="flex-1 flex flex-col gap-4">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Hey, I&apos;m Tal, your job-fixing agent on WhatsApp.
              </h1>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                I help ambitious professionals escape bad hikes, toxic teams and
                lowball offers — by sending one serious job a day on WhatsApp.
                How would you describe your current situation?
              </p>
            </div>

            {/* Chat Widget */}
            <div className="w-full md:w-auto flex justify-center md:justify-end">
              <ChatOnboarding onComplete={handleChatComplete} />
            </div>
          </section>
        )}

        {/* Persona Buttons */}
        {state === "persona" && (
          <section className="flex flex-col gap-3">
            {PERSONAS.map((persona) => (
              <button
                key={persona}
                onClick={() => handlePersonaSelect(persona)}
                className="w-full text-left rounded-full border border-slate-600 bg-slate-900/50 px-4 py-3 text-sm md:text-base hover:bg-slate-800 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                {persona}
              </button>
            ))}
          </section>
        )}

        {/* Interstitial State */}
        {state === "interstitial" && (
          <section className="flex flex-col gap-6 animate-fade-in-up">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-4xl font-bold">
                Nice to meet you 👋
              </h2>
              <p className="text-sm md:text-base text-slate-400">
                Got it, you&apos;re{" "}
                <span className="text-slate-200 font-medium">
                  {selectedPersona?.toLowerCase()}
                </span>
                .
              </p>
              <p className="text-sm md:text-base text-slate-400">
                Drop a few details and I&apos;ll start sending you 1 high-signal
                job a day on WhatsApp — no spam, no random job board nonsense.
              </p>
              <p className="text-xs text-slate-500">
                Takes less than 60 seconds.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setState("form")}
                className="w-full inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium bg-orange-500 text-slate-950 hover:bg-orange-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-slate-950"
              >
                Fill my details
              </button>
              <button
                onClick={() => setState("persona")}
                className="w-full text-center text-sm text-slate-400 hover:text-slate-200 transition-colors py-2"
              >
                Change my answer
              </button>
            </div>
          </section>
        )}

        {/* Form State */}
        {state === "form" && (
          <section className="flex flex-col gap-6 animate-fade-in-up">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl md:text-2xl font-bold">
                Tell me a bit about yourself
              </h2>
              <p className="text-sm text-slate-400">
                This helps me find the right jobs for you.
              </p>
            </div>

            <LeadForm
              selectedPersona={selectedPersona || ""}
              prefill={chatPrefill}
              onSuccess={() => setState("success")}
              onError={() => setState("error")}
            />

            <button
              onClick={() => setState("interstitial")}
              className="text-center text-sm text-slate-400 hover:text-slate-200 transition-colors py-2"
            >
              Go back
            </button>
          </section>
        )}

        {/* Success State */}
        {state === "success" && (
          <section className="flex flex-col gap-6 animate-fade-in-up text-center py-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-4xl font-bold">
                You&apos;re in. I&apos;ll text you on WhatsApp 📲
              </h2>
              <p className="text-sm md:text-base text-slate-400 max-w-md mx-auto">
                Tal will message you on WhatsApp shortly with a quick hello,
                then send you 1 serious job a day, plus salary insights and
                nudges. If you don&apos;t see a message in the next few minutes,
                double-check that your WhatsApp number is correct or ping us at{" "}
                <a
                  href="mailto:hey@taljobs.in"
                  className="text-orange-400 hover:text-orange-300 underline"
                >
                  hey@taljobs.in
                </a>
                .
              </p>
            </div>

            <button
              onClick={resetToStart}
              className="w-full md:w-auto md:mx-auto inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium bg-slate-800 text-slate-50 hover:bg-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-slate-950"
            >
              Back to start
            </button>
          </section>
        )}

        {/* Error State */}
        {state === "error" && (
          <section className="flex flex-col gap-6 animate-fade-in-up text-center py-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-4xl font-bold">
                Oops, something broke.
              </h2>
              <p className="text-sm md:text-base text-slate-400 max-w-md mx-auto">
                Please retry in a few seconds. If it keeps failing, take a
                screenshot and email us at{" "}
                <a
                  href="mailto:hey@taljobs.in"
                  className="text-orange-400 hover:text-orange-300 underline"
                >
                  hey@taljobs.in
                </a>{" "}
                — we&apos;ll get you added manually.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto md:mx-auto">
              <button
                onClick={() => setState("form")}
                className="w-full inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium bg-orange-500 text-slate-950 hover:bg-orange-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-slate-950"
              >
                Try again
              </button>
              <button
                onClick={resetToStart}
                className="text-center text-sm text-slate-400 hover:text-slate-200 transition-colors py-2"
              >
                Back to start
              </button>
            </div>
          </section>
        )}

        {/* Explainer Section - Always visible */}
        <section className="mt-8 pt-8 border-t border-slate-800">
          <h3 className="text-xl md:text-2xl font-bold">
            What exactly does Tal do?
          </h3>
          <p className="mt-3 text-sm md:text-base text-slate-400 leading-relaxed">
            Tal lives on WhatsApp and behaves like a slightly unhinged career
            agent. You get 1 high-signal job a day, curated based on your
            skills, salary band and city — plus reminders, interview nudges and
            salary insights.
          </p>

          {/* Video Placeholder */}
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 aspect-video flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-slate-400"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm text-slate-500">
              60-second explainer (coming soon)
            </span>
          </div>
        </section>

        {/* Logo Strip Section */}
        <section className="mt-8">
          <h3 className="text-lg md:text-xl font-semibold text-slate-300">
            People who use Tal work at
          </h3>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {COMPANIES.map((company) => (
              <div
                key={company}
                className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-center text-slate-400"
              >
                {company}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-800 px-4 py-4">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>© 2025 Watercooler Chat Pvt. Ltd. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-200 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-200 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
