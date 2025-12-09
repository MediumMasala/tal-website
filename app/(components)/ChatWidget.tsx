"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  companyConfig,
  ChatMessage,
  ChatStep,
  LeadPayload,
} from "@/lib/companyConfig";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState<ChatStep>("intro");
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(false);

  // Form data
  const [basicAsk, setBasicAsk] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [userWorkplace, setUserWorkplace] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addMessage = useCallback((from: "tal" | "user", text: string) => {
    const message: ChatMessage = {
      id: generateId(),
      from,
      text,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, message]);
  }, []);

  const addTalMessage = useCallback(
    (text: string, delay = 0): Promise<void> => {
      return new Promise((resolve) => {
        if (delay > 0) {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addMessage("tal", text);
            resolve();
          }, delay);
        } else {
          addMessage("tal", text);
          resolve();
        }
      });
    },
    [addMessage]
  );

  // Initialize chat with intro messages
  useEffect(() => {
    const initChat = async () => {
      await addTalMessage("hi, my name is tal", 500);
      await addTalMessage(
        `i help ${companyConfig.shortName} employees find better opportunities in ${companyConfig.marketLabel}.`,
        700
      );
      await addTalMessage(
        "tell me what you're looking for next (role, location, salary...)",
        800
      );
      setCurrentStep("askIntent");
    };

    initChat();
  }, [addTalMessage]);

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, "");
    return cleaned.length >= 10;
  };

  const submitLead = async () => {
    setIsSubmitting(true);
    setApiError(false);

    const payload: LeadPayload = {
      companySlug: companyConfig.slug,
      companyName: companyConfig.name,
      whatsAppNumber,
      userName,
      userWorkplace,
      basicAsk,
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      utm: {
        raw: typeof window !== "undefined" ? window.location.search : "",
      },
    };

    try {
      const response = await fetch("/api/register-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      return true;
    } catch (error) {
      console.error("Error submitting lead:", error);
      setApiError(true);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const input = inputValue.trim();
    if (!input || isSubmitting) return;

    addMessage("user", input);
    setInputValue("");

    switch (currentStep) {
      case "askIntent":
        setBasicAsk(input);
        await addTalMessage("got it. sounds like we can help with that.", 500);
        await addTalMessage(
          "to send you relevant jobs, i need a couple of details.",
          600
        );
        await addTalMessage("what's your WhatsApp number?", 500);
        setCurrentStep("askPhone");
        break;

      case "askPhone":
        if (!validatePhone(input)) {
          await addTalMessage(
            "hmm, that doesn't look like a valid number. please enter your 10+ digit WhatsApp number.",
            400
          );
          return;
        }
        setWhatsAppNumber(input);
        await addTalMessage("thanks. and what's your name?", 500);
        setCurrentStep("askName");
        break;

      case "askName":
        setUserName(input);
        await addTalMessage(`nice to meet you, ${input}!`, 500);
        await addTalMessage(
          `which team or office do you work in at ${companyConfig.shortName}?`,
          600
        );
        setCurrentStep("askCompany");
        break;

      case "askCompany":
        setUserWorkplace(input);

        // Submit to API
        const success = await submitLead();

        if (success) {
          await addTalMessage(
            "perfect. i'm going to text you on WhatsApp with 1 serious job a day.",
            600
          );
          await addTalMessage("tap below to open our chat now", 500);
        } else {
          await addTalMessage(
            "couldn't save your details right now, but you can still tap below to open WhatsApp.",
            500
          );
        }

        setCurrentStep("final");
        break;

      case "final":
        await addTalMessage(
          "i've already saved your details. check WhatsApp for updates!",
          400
        );
        break;
    }

    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const openWhatsApp = () => {
    window.open(companyConfig.talWhatsAppLink, "_blank");
  };

  return (
    <div className="chat-widget flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
      {/* Chat Header */}
      <div className="chat-header flex items-center gap-3 px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: companyConfig.primaryColor }}
          >
            T
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white">Tal</div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Online now
          </div>
        </div>
        <svg
          className="w-5 h-5 text-slate-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-900 to-slate-950">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 text-sm rounded-2xl ${
                msg.from === "tal"
                  ? "bg-slate-800 text-slate-100 rounded-bl-md"
                  : "text-white rounded-br-md"
              }`}
              style={
                msg.from === "user"
                  ? { backgroundColor: companyConfig.primaryColor }
                  : {}
              }
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* WhatsApp button after final step */}
        {currentStep === "final" && (
          <div className="flex justify-start animate-fade-in-up">
            <button
              onClick={openWhatsApp}
              className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-500 text-white rounded-2xl text-sm font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Open WhatsApp chat with Tal
            </button>
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
              <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
              <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
              <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
            </div>
          </div>
        )}

        {apiError && (
          <div className="text-xs text-amber-400 text-center py-2">
            Connection issue - but you can still use WhatsApp below
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="chat-input-bar px-3 py-3 bg-slate-800 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              currentStep === "final"
                ? "Already registered!"
                : "Type a message..."
            }
            className="flex-1 bg-slate-700 text-white placeholder:text-slate-400 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            disabled={isSubmitting}
          />
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isSubmitting}
            className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40 transition-opacity text-white"
            style={{ backgroundColor: companyConfig.primaryColor }}
          >
            {isSubmitting ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
