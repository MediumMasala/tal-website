"use client";

import { useState } from "react";
import InteractivePhone from "./(components)/InteractivePhone";

const COMPANIES = [
  "Google", "Microsoft", "Amazon", "Flipkart", "Swiggy",
  "CRED", "Razorpay", "Zerodha", "PhonePe", "Atlassian",
];

export default function Home() {
  const [isComplete, setIsComplete] = useState(false);

  return (
    <div className="min-h-screen gradient-bg-warm overflow-x-hidden">
      {/* Decorative blobs */}
      <div className="blob-decoration blob-orange w-[500px] h-[500px] -top-[200px] right-[10%] fixed" />
      <div className="blob-decoration blob-purple w-[400px] h-[400px] top-[40%] -left-[100px] fixed" />
      <div className="blob-decoration blob-orange w-[300px] h-[300px] bottom-[10%] right-[5%] fixed" />

      {/* Main container */}
      <div className="relative min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Tal</span>
            </div>
            <a
              href="mailto:hey@taljobs.in"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8">
          {/* Hero text */}
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              Now helping 1000+ professionals
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-5">
              Your friendly{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                job-fixing agent
              </span>
              {" "}on WhatsApp
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto">
              Chat with Tal below. Get 1 serious, relevant job a day — no spam, no nonsense.
            </p>
          </div>

          {/* Interactive Phone */}
          <div className="relative mb-8">
            <InteractivePhone onComplete={() => setIsComplete(true)} />
          </div>

          {/* Success indicator */}
          {isComplete && (
            <div className="px-6 py-3 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm animate-fade-in-up flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You&apos;re all set! Check WhatsApp for a message from Tal
            </div>
          )}
        </main>

        {/* Companies */}
        <section className="py-12 px-4 border-t border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-400 mb-6 uppercase tracking-wider">
              Tal users work at
            </p>
            <div className="flex items-center justify-center flex-wrap gap-4">
              {COMPANIES.map((company) => (
                <div
                  key={company}
                  className="brand-chip px-4 py-2 rounded-full text-gray-500 text-sm font-medium"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 px-4 border-t border-gray-100 bg-white/50">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <span>© 2025 Watercooler Chat Pvt. Ltd.</span>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
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
