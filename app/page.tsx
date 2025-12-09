"use client";

import Image from "next/image";
import ChatWidget from "./(components)/ChatWidget";
import { companyConfig } from "@/lib/companyConfig";

export default function Home() {
  const openWhatsApp = () => {
    window.open(companyConfig.talWhatsAppLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile: Full chat experience */}
      <div className="md:hidden min-h-screen flex flex-col">
        {/* Compact mobile header */}
        <div className="px-4 pt-6 pb-4 bg-slate-950">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
            style={{
              backgroundColor: `${companyConfig.primaryColor}15`,
              color: companyConfig.primaryColor,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: companyConfig.primaryColor }}
            ></span>
            {companyConfig.employeeCountText}
          </div>

          {/* Headline */}
          <h1 className="text-xl font-bold text-white mb-2">
            For{" "}
            <span style={{ color: companyConfig.primaryColor }}>
              {companyConfig.name}
            </span>{" "}
            employees
          </h1>
          <p className="text-sm text-slate-400">
            Find better jobs on WhatsApp with Tal
          </p>
        </div>

        {/* Chat widget - fills remaining space */}
        <div className="flex-1 px-2 pb-2">
          <ChatWidget />
        </div>
      </div>

      {/* Desktop: Two-column layout */}
      <div className="hidden md:block">
        <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left column: Hero */}
            <div className="space-y-8">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${companyConfig.primaryColor}15`,
                  color: companyConfig.primaryColor,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: companyConfig.primaryColor }}
                ></span>
                {companyConfig.employeeCountText}
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  For{" "}
                  <span
                    className="inline-flex items-center gap-3"
                    style={{ color: companyConfig.primaryColor }}
                  >
                    <CompanyLogo />
                    {companyConfig.name}
                  </span>{" "}
                  employees: find better jobs on WhatsApp
                </h1>

                <p className="text-lg text-slate-400 max-w-lg">
                  Tal is a job-fixing agent on WhatsApp. Get 1 serious, relevant
                  job a day - no spam, no random HR calls.
                </p>
              </div>

              {/* CTA Button */}
              <div className="space-y-3">
                <button
                  onClick={openWhatsApp}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor: companyConfig.primaryColor,
                    boxShadow: `0 4px 24px ${companyConfig.primaryColor}40`,
                  }}
                >
                  Chat with Tal on WhatsApp
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </button>

                <p className="text-sm text-slate-500">
                  Opens a WhatsApp chat with Tal - your personal job agent
                </p>
              </div>

              {/* Social proof */}
              <div className="pt-4 space-y-3">
                <p className="text-sm text-slate-500">
                  Built for {companyConfig.name} employees in{" "}
                  {companyConfig.marketLabel}.
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    1 serious job a day
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    No spam
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Free to try
                  </span>
                </div>
              </div>
            </div>

            {/* Right column: Chat widget */}
            <div className="h-[600px] lg:h-[650px]">
              <ChatWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanyLogo() {
  return (
    <Image
      src={companyConfig.logoUrl}
      alt={`${companyConfig.name} logo`}
      width={40}
      height={40}
      className="inline-block"
      onError={(e) => {
        // Hide if logo fails to load
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
