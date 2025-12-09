"use client";

import { useState } from "react";
import InteractivePhone from "./(components)/InteractivePhone";

const COMPANIES = [
  "Google", "Microsoft", "Amazon", "Flipkart", "Swiggy",
  "CRED", "Razorpay", "Zerodha", "PhonePe", "Meesho",
  "Atlassian", "Uber", "Ola", "Paytm",
];

export default function Home() {
  const [isComplete, setIsComplete] = useState(false);

  return (
    <div className="min-h-screen gradient-bg overflow-x-hidden">
      {/* Decorative circles */}
      <div className="circle-decoration w-[800px] h-[800px] -top-[300px] left-1/2 -translate-x-1/2 fixed opacity-40" />
      <div className="circle-decoration w-[500px] h-[500px] bottom-[10%] -right-[200px] fixed opacity-30" />
      <div className="circle-decoration w-[400px] h-[400px] bottom-[20%] -left-[150px] fixed opacity-20" />

      {/* Main container */}
      <div className="relative min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-center">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-base font-bold shadow-lg">
                T
              </div>
              <span className="text-lg">Tal</span>
            </div>
          </div>
        </nav>

        {/* Main content - Phone front and center */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-6">
          {/* Hero text above phone */}
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                job-fixing agent
              </span>
              {" "}on WhatsApp
            </h1>
            <p className="text-base md:text-lg text-white/50">
              Chat with Tal below to get started
            </p>
          </div>

          {/* Interactive Phone - Front and Center */}
          <div className="relative">
            {/* Glow effect behind phone */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-transparent blur-3xl scale-150 -z-10" />

            <InteractivePhone onComplete={() => setIsComplete(true)} />
          </div>

          {/* Success indicator */}
          {isComplete && (
            <div className="mt-6 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm animate-fade-in-up">
              <span className="mr-2">✓</span>
              You&apos;re all set! Check WhatsApp for a message from Tal
            </div>
          )}
        </main>

        {/* Logo Strip */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs text-white/40 mb-4 uppercase tracking-wider">
              Tal users work at
            </p>
            <div className="logo-strip overflow-hidden">
              <div className="flex items-center justify-center flex-wrap gap-3 md:gap-4">
                {COMPANIES.map((company) => (
                  <div
                    key={company}
                    className="px-3 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs font-medium"
                  >
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-4 px-4 border-t border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <span>© 2025 Watercooler Chat Pvt. Ltd.</span>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
