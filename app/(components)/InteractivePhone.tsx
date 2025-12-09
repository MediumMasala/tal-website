"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
  id: string;
  from: "tal" | "user";
  text: string;
  type?: "text" | "options";
  options?: { key: string; label: string }[];
}

interface FormData {
  persona?: string;
  name?: string;
  phone?: string;
  email?: string;
  role?: string;
  experience?: string;
  city?: string;
  skill?: string;
}

type ChatStep =
  | "intro"
  | "persona"
  | "name"
  | "phone"
  | "email"
  | "role"
  | "experience"
  | "city"
  | "skill"
  | "submitting"
  | "done"
  | "error";

const PERSONAS = [
  { key: "A", label: "I'm underpaid where I am" },
  { key: "B", label: "I'm actively job hunting" },
  { key: "C", label: "I've been laid off" },
  { key: "D", label: "Just exploring options" },
  { key: "E", label: "I hire for roles" },
];

const EXPERIENCE_OPTIONS = ["0-1 years", "1-3 years", "3-5 years", "5-8 years", "8+ years"];

const SKILL_OPTIONS = [
  "Software / Backend",
  "Frontend / Web",
  "Data / ML",
  "Product Management",
  "Design (UI/UX)",
  "Sales",
  "Marketing",
  "Other",
];

const PERSONA_RESPONSES: Record<string, string> = {
  "I'm underpaid where I am": "i get it. let's find you something that pays what you're actually worth",
  "I'm actively job hunting": "perfect timing. let's speed this up",
  "I've been laid off": "been there. let's get you back on track fast",
  "Just exploring options": "smart move. i'll show you what's out there",
  "I hire for roles": "nice! i can help you find great talent too",
};

interface InteractivePhoneProps {
  onComplete?: (data: FormData) => void;
}

export default function InteractivePhone({ onComplete }: InteractivePhoneProps) {
  const [step, setStep] = useState<ChatStep>("intro");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [formData, setFormData] = useState<FormData>({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addMessage = useCallback((message: Omit<Message, "id">) => {
    const newMessage: Message = {
      ...message,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const addTalMessage = useCallback((text: string, delay = 0) => {
    return new Promise<void>((resolve) => {
      if (delay > 0) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage({ from: "tal", text, type: "text" });
          resolve();
        }, delay);
      } else {
        addMessage({ from: "tal", text, type: "text" });
        resolve();
      }
    });
  }, [addMessage]);

  useEffect(() => {
    const initChat = async () => {
      await addTalMessage("hey, i'm tal 👋", 500);
      await addTalMessage("your job-fixing agent on whatsapp", 700);
      await addTalMessage("i send you 1 serious job a day — no spam, no nonsense", 900);
      await addTalMessage("what brings you here today?", 700);

      setMessages((prev) => [
        ...prev,
        {
          id: "persona-options",
          from: "tal",
          text: "",
          type: "options",
          options: PERSONAS,
        },
      ]);
      setStep("persona");
    };

    initChat();
  }, [addTalMessage]);

  const handleOptionSelect = async (option: { key: string; label: string }) => {
    addMessage({ from: "user", text: option.label, type: "text" });
    setMessages((prev) => prev.filter((m) => m.type !== "options"));

    if (step === "persona") {
      setFormData((prev) => ({ ...prev, persona: option.label }));
      await addTalMessage(PERSONA_RESPONSES[option.label] || "got it!", 500);
      await addTalMessage("let's get you set up. what's your name?", 600);
      setStep("name");
      inputRef.current?.focus();
    }
  };

  const handleSelectOption = async (option: string) => {
    addMessage({ from: "user", text: option, type: "text" });

    if (step === "experience") {
      setFormData((prev) => ({ ...prev, experience: option }));
      await addTalMessage("and which city are you based in?", 500);
      setStep("city");
    } else if (step === "skill") {
      setFormData((prev) => ({ ...prev, skill: option }));
      await addTalMessage("perfect! that's all i need 🎉", 500);
      await addTalMessage("setting you up now...", 400);
      setStep("submitting");
      await submitForm({ ...formData, skill: option });
    }
  };

  const submitForm = async (data: FormData) => {
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedPersona: data.persona,
          fullName: data.name,
          whatsAppNumber: data.phone,
          email: data.email,
          currentRole: data.role,
          currentCompany: "",
          experienceBand: data.experience,
          city: data.city,
          primarySkill: data.skill,
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        await addTalMessage("you're in! i'll text you on whatsapp shortly 📱", 600);
        await addTalMessage("expect your first job within 24 hours", 500);
        setStep("done");
        onComplete?.(data);
      } else {
        throw new Error("Failed");
      }
    } catch {
      await addTalMessage("oops, something went wrong. try again?", 500);
      setStep("error");
    }
  };

  const handleSubmit = async () => {
    const input = currentInput.trim();
    if (!input) return;

    addMessage({ from: "user", text: input, type: "text" });
    setCurrentInput("");

    switch (step) {
      case "name":
        setFormData((prev) => ({ ...prev, name: input }));
        await addTalMessage(`nice to meet you, ${input}! 🙌`, 500);
        await addTalMessage("what's your whatsapp number?", 500);
        setStep("phone");
        break;
      case "phone":
        setFormData((prev) => ({ ...prev, phone: input }));
        await addTalMessage("got it! and your email?", 500);
        setStep("email");
        break;
      case "email":
        setFormData((prev) => ({ ...prev, email: input }));
        await addTalMessage("what's your current role?", 500);
        setStep("role");
        break;
      case "role":
        setFormData((prev) => ({ ...prev, role: input }));
        await addTalMessage("how many years of experience?", 500);
        setStep("experience");
        break;
      case "city":
        setFormData((prev) => ({ ...prev, city: input }));
        await addTalMessage("last one — what's your primary skill area?", 500);
        setStep("skill");
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getPlaceholder = () => {
    switch (step) {
      case "name": return "Your name...";
      case "phone": return "+91 98765 43210";
      case "email": return "you@example.com";
      case "role": return "e.g. Senior Engineer";
      case "city": return "e.g. Bengaluru";
      default: return "Type a message...";
    }
  };

  const showInput = ["name", "phone", "email", "role", "city"].includes(step);
  const showExperienceOptions = step === "experience";
  const showSkillOptions = step === "skill";

  return (
    <div className="phone-mockup-light rounded-[2.5rem] w-[320px] md:w-[360px] lg:w-[400px] mx-auto">
      {/* Phone notch */}
      <div className="phone-notch-light mx-auto w-28 h-6 relative z-10" />

      {/* Screen */}
      <div className="px-4 pb-4 -mt-1 bg-white rounded-b-[2.5rem]">
        {/* Status bar */}
        <div className="flex items-center justify-between px-2 py-2 text-xs text-gray-500">
          <span className="font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3C8.5 3 5.5 4.5 3.5 7L12 22L20.5 7C18.5 4.5 15.5 3 12 3Z" />
            </svg>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 22H22V2C12 2 2 12 2 22Z" />
            </svg>
            <div className="w-6 h-2.5 rounded-sm border border-gray-400 relative">
              <div className="absolute inset-0.5 bg-green-500 rounded-sm" style={{ width: "75%" }} />
            </div>
          </div>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-3 px-1 py-3 border-b border-gray-100">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Tal</div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              online now
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[340px] md:h-[380px] lg:h-[420px] overflow-y-auto py-3 space-y-2.5 chat-messages">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.type === "options" ? (
                <div className="space-y-2 animate-fade-in-up">
                  {msg.options?.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleOptionSelect(option)}
                      className="option-btn-light w-full text-left px-4 py-3 rounded-2xl text-sm flex items-center gap-3"
                    >
                      <span className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-semibold text-orange-600">
                        {option.key}
                      </span>
                      <span className="text-gray-700">{option.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-sm ${
                      msg.from === "tal"
                        ? "chat-bubble-tal-light"
                        : "chat-bubble-user-light"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              )}
            </div>
          ))}

          {showExperienceOptions && (
            <div className="space-y-2 animate-fade-in-up">
              {EXPERIENCE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  className="option-btn-light w-full text-left px-4 py-3 rounded-2xl text-sm text-gray-700"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {showSkillOptions && (
            <div className="space-y-2 animate-fade-in-up">
              {SKILL_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  className="option-btn-light w-full text-left px-4 py-3 rounded-2xl text-sm text-gray-700"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="chat-bubble-tal-light px-4 py-3 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-orange-400 rounded-full typing-dot" />
                <div className="w-2 h-2 bg-orange-400 rounded-full typing-dot" />
                <div className="w-2 h-2 bg-orange-400 rounded-full typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          {showInput ? (
            <>
              <input
                ref={inputRef}
                type={step === "email" ? "email" : step === "phone" ? "tel" : "text"}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={getPlaceholder()}
                className="form-input-light flex-1 rounded-full px-4 py-2.5 text-sm focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSubmit}
                disabled={!currentInput.trim()}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center disabled:opacity-40 transition-opacity shadow-md"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </>
          ) : (
            <div className="flex-1 rounded-full px-4 py-2.5 text-sm text-gray-400 bg-gray-50 border border-gray-100">
              {step === "done" ? "You're all set! ✨" : step === "submitting" ? "Setting you up..." : "Select an option above"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
