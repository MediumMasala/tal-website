"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
  id: string;
  from: "tal" | "user";
  text: string;
  type?: "text" | "options" | "input";
  options?: { key: string; label: string }[];
  inputType?: "text" | "phone" | "email" | "select";
  selectOptions?: string[];
  field?: string;
}

interface FormData {
  persona?: string;
  name?: string;
  phone?: string;
  email?: string;
  role?: string;
  company?: string;
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
  "Marketing / Growth",
  "Other",
];

const PERSONA_RESPONSES: Record<string, string> = {
  "I'm underpaid where I am": "i get it. let's find you something that pays what you're actually worth 💰",
  "I'm actively job hunting": "perfect timing. let's speed this up ⚡",
  "I've been laid off": "been there. let's get you back on track fast 🚀",
  "Just exploring options": "smart move. i'll show you what's out there 👀",
  "I hire for roles": "nice! i can help you find great talent too 🤝",
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

  // Initialize chat
  useEffect(() => {
    const initChat = async () => {
      await addTalMessage("hey, i'm tal 👋", 500);
      await addTalMessage("your job-fixing agent on whatsapp", 800);
      await addTalMessage("i send you 1 serious job a day — no spam, no job board nonsense", 1000);
      await addTalMessage("first, tell me what brings you here?", 800);

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
    // Add user message
    addMessage({ from: "user", text: option.label, type: "text" });

    // Remove options message
    setMessages((prev) => prev.filter((m) => m.type !== "options"));

    if (step === "persona") {
      setFormData((prev) => ({ ...prev, persona: option.label }));
      await addTalMessage(PERSONA_RESPONSES[option.label] || "got it!", 600);
      await addTalMessage("let's get you set up. what's your name?", 800);
      setStep("name");
      inputRef.current?.focus();
    }
  };

  const handleSelectOption = async (option: string) => {
    addMessage({ from: "user", text: option, type: "text" });

    if (step === "experience") {
      setFormData((prev) => ({ ...prev, experience: option }));
      await addTalMessage("and which city are you in?", 600);
      setStep("city");
    } else if (step === "skill") {
      setFormData((prev) => ({ ...prev, skill: option }));
      await addTalMessage("perfect, that's all i need! 🎉", 600);
      await addTalMessage("let me set you up...", 400);
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
          currentCompany: data.company || "",
          experienceBand: data.experience,
          city: data.city,
          primarySkill: data.skill,
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        await addTalMessage("you're in! i'll text you on whatsapp shortly 📱", 800);
        await addTalMessage("expect your first job within 24 hours", 600);
        setStep("done");
        onComplete?.(data);
      } else {
        throw new Error("Failed to submit");
      }
    } catch {
      await addTalMessage("oops, something went wrong. try again?", 600);
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
        await addTalMessage(`nice to meet you, ${input}! 🙌`, 600);
        await addTalMessage("what's your whatsapp number?", 600);
        setStep("phone");
        break;

      case "phone":
        setFormData((prev) => ({ ...prev, phone: input }));
        await addTalMessage("got it! and your email?", 600);
        setStep("email");
        break;

      case "email":
        setFormData((prev) => ({ ...prev, email: input }));
        await addTalMessage("what's your current role?", 600);
        setStep("role");
        break;

      case "role":
        setFormData((prev) => ({ ...prev, role: input }));
        await addTalMessage("how many years of experience do you have?", 600);
        setStep("experience");
        break;

      case "city":
        setFormData((prev) => ({ ...prev, city: input }));
        await addTalMessage("last one — what's your primary skill area?", 600);
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
    <div className="phone-mockup rounded-[3rem] w-[340px] md:w-[380px] lg:w-[420px] mx-auto shadow-2xl">
      {/* Phone notch */}
      <div className="phone-notch mx-auto w-32 h-7 relative z-10" />

      {/* Screen */}
      <div className="px-4 pb-5 -mt-2">
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
              <div className="absolute inset-0.5 bg-green-500 rounded-sm" style={{ width: "80%" }} />
            </div>
          </div>
        </div>

        {/* Chat header with Tal logo */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-white/10">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0d0f1a]" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-base">Tal</div>
            <div className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              online now
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/60">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[380px] md:h-[420px] lg:h-[460px] overflow-y-auto py-4 space-y-3 chat-messages">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.type === "options" ? (
                <div className="space-y-2 animate-fade-in-up">
                  {msg.options?.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleOptionSelect(option)}
                      className="w-full text-left px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all text-sm flex items-center gap-3"
                    >
                      <span className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-medium text-orange-400">
                        {option.key}
                      </span>
                      <span className="text-white/90">{option.label}</span>
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
                        ? "chat-bubble-tal text-white/90"
                        : "chat-bubble-user text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Experience options */}
          {showExperienceOptions && (
            <div className="space-y-2 animate-fade-in-up">
              {EXPERIENCE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  className="w-full text-left px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all text-sm text-white/90"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Skill options */}
          {showSkillOptions && (
            <div className="space-y-2 animate-fade-in-up">
              {SKILL_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  className="w-full text-left px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all text-sm text-white/90"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="chat-bubble-tal px-4 py-3 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-orange-400 rounded-full typing-dot" />
                <div className="w-2 h-2 bg-orange-400 rounded-full typing-dot" />
                <div className="w-2 h-2 bg-orange-400 rounded-full typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 mt-3">
          {showInput ? (
            <>
              <input
                ref={inputRef}
                type={step === "email" ? "email" : step === "phone" ? "tel" : "text"}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={getPlaceholder()}
                className="flex-1 bg-white/5 rounded-full px-4 py-3 text-sm text-white placeholder:text-white/40 border border-white/10 focus:border-orange-500/50 focus:outline-none transition-colors"
                autoFocus
              />
              <button
                onClick={handleSubmit}
                disabled={!currentInput.trim()}
                className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center disabled:opacity-40 transition-opacity shadow-lg"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </>
          ) : (
            <div className="flex-1 bg-white/5 rounded-full px-4 py-3 text-sm text-white/40 border border-white/10">
              {step === "done" ? "You're all set! ✨" : step === "submitting" ? "Setting you up..." : "Select an option above"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
