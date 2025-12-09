"use client";

import { useEffect, useState } from "react";

interface Message {
  id: string;
  from: "tal" | "user";
  text: string;
  delay: number;
}

const INITIAL_MESSAGES: Message[] = [
  { id: "1", from: "tal", text: "hey, i'm tal 👋", delay: 0 },
  { id: "2", from: "tal", text: "your job-fixing agent on whatsapp", delay: 800 },
  { id: "3", from: "tal", text: "i send you 1 serious job a day — no spam, no job board nonsense", delay: 1600 },
];

interface PhoneMockupProps {
  expanded?: boolean;
  selectedPersona?: string | null;
  className?: string;
}

export default function PhoneMockup({
  expanded = false,
  selectedPersona,
  className = "",
}: PhoneMockupProps) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showPersonaResponse, setShowPersonaResponse] = useState(false);

  useEffect(() => {
    // Reset and show initial messages with typing effect
    setVisibleMessages([]);
    setIsTyping(true);

    INITIAL_MESSAGES.forEach((msg, index) => {
      setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg]);
        if (index === INITIAL_MESSAGES.length - 1) {
          setIsTyping(false);
        }
      }, msg.delay + 500);
    });
  }, []);

  useEffect(() => {
    if (selectedPersona && !showPersonaResponse) {
      setShowPersonaResponse(true);
      setIsTyping(true);

      // Add user message
      setTimeout(() => {
        setVisibleMessages((prev) => [
          ...prev,
          { id: "user-1", from: "user", text: selectedPersona, delay: 0 },
        ]);
      }, 200);

      // Add Tal response
      setTimeout(() => {
        setVisibleMessages((prev) => [
          ...prev,
          { id: "tal-response", from: "tal", text: "nice! let's get you set up 🚀", delay: 0 },
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [selectedPersona, showPersonaResponse]);

  return (
    <div
      className={`phone-mockup rounded-[3rem] w-[280px] md:w-[320px] transition-all duration-700 ${
        expanded ? "scale-105" : ""
      } ${className}`}
    >
      {/* Phone notch */}
      <div className="phone-notch mx-auto w-32 h-7 relative z-10" />

      {/* Screen */}
      <div className="px-3 pb-4 -mt-2">
        {/* Status bar */}
        <div className="flex items-center justify-between px-2 py-2 text-xs text-white/60">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3C8.5 3 5.5 4.5 3.5 7L12 22L20.5 7C18.5 4.5 15.5 3 12 3Z" />
            </svg>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 22H22V2C12 2 2 12 2 22Z" />
            </svg>
            <div className="w-6 h-3 rounded-sm border border-white/60 relative">
              <div className="absolute inset-0.5 bg-white/60 rounded-sm" style={{ width: "70%" }} />
            </div>
          </div>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-white/10">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d0f1a]" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">Tal</div>
            <div className="text-xs text-green-400">online</div>
          </div>
          <div className="flex items-center gap-3 text-white/60">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[320px] md:h-[380px] overflow-y-auto py-4 space-y-3">
          {visibleMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 text-sm ${
                  msg.from === "tal" ? "chat-bubble-tal" : "chat-bubble-user"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="chat-bubble-tal px-4 py-3 flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full typing-dot" />
                <div className="w-2 h-2 bg-orange-400 rounded-full typing-dot" />
                <div className="w-2 h-2 bg-orange-400 rounded-full typing-dot" />
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-white/5 rounded-full px-4 py-2.5 text-sm text-white/40 border border-white/10">
            Type a message...
          </div>
          <button className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
