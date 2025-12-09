"use client";

import { useState, useEffect, useRef } from "react";

type ChatStep = "askName" | "askPhone" | "askCompany" | "done";

interface Message {
  id: string;
  from: "tal" | "user";
  text: string;
}

interface ChatOnboardingProps {
  onComplete?: (data: { name: string; phone: string; company: string }) => void;
}

export default function ChatOnboarding({ onComplete }: ChatOnboardingProps) {
  const [step, setStep] = useState<ChatStep>("askName");
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [currentInput, setCurrentInput] = useState("");
  const [hasSentToBackend, setHasSentToBackend] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addMessage = (from: "tal" | "user", text: string) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from,
      text,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Initial message on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      addMessage("tal", "hey, i'm tal 👋 what's your name?");
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send to backend when done
  useEffect(() => {
    if (step === "done" && !hasSentToBackend) {
      setHasSentToBackend(true);
      onComplete?.({ name, phone, company });

      fetch("/api/chat-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          company,
          createdAt: new Date().toISOString(),
        }),
      }).catch((err) => {
        console.error("Failed to send chat onboarding data:", err);
      });
    }
  }, [step, hasSentToBackend, name, phone, company, onComplete]);

  const handleSubmit = () => {
    const input = currentInput.trim();
    if (!input || step === "done") return;

    addMessage("user", input);
    setCurrentInput("");

    // Process based on current step
    setTimeout(() => {
      if (step === "askName") {
        setName(input);
        setStep("askPhone");
        addMessage("tal", `nice to meet you, ${input}. what's your whatsapp number?`);
      } else if (step === "askPhone") {
        setPhone(input);
        setStep("askCompany");
        addMessage("tal", "got it. where do you work right now? (company / team)");
      } else if (step === "askCompany") {
        setCompany(input);
        setStep("done");
        addMessage("tal", "perfect. i'll use this to send you sharper job matches.");
        setTimeout(() => {
          addMessage("tal", "i'll message you on whatsapp soon with your first job. 🟢");
        }, 400);
      }
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900/70 shadow-lg p-4 flex flex-col gap-3 transition-transform duration-150 hover:-translate-y-1 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-slate-950 font-bold text-sm">
          Tal
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-sm">Tal</span>
          <span className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            online
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pt-2 chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`animate-fade-in-up ${
              msg.from === "tal" ? "self-start" : "self-end"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-2xl text-sm max-w-[80%] ${
                msg.from === "tal"
                  ? "bg-slate-800 text-slate-50 rounded-bl-sm"
                  : "bg-orange-500 text-slate-950 rounded-br-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-2 flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={step === "done"}
          placeholder={step === "done" ? "you're all set 👍" : "Type a message..."}
          className="flex-1 rounded-full bg-slate-800 border border-slate-700 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSubmit}
          disabled={step === "done" || !currentInput.trim()}
          className="w-9 h-9 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center hover:bg-orange-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-slate-950"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
