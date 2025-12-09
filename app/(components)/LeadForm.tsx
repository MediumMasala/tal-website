"use client";

import { useState, FormEvent } from "react";

interface LeadFormProps {
  selectedPersona: string;
  onSuccess: () => void;
  onError: () => void;
  onBack: () => void;
}

interface FormErrors {
  [key: string]: string;
}

export default function LeadForm({
  selectedPersona,
  onSuccess,
  onError,
  onBack,
}: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: "",
    whatsAppNumber: "",
    email: "",
    currentRole: "",
    currentCompany: "",
    experienceBand: "",
    city: "",
    primarySkill: "",
    currentCTC: "",
    targetCTC: "",
    noticePeriod: "",
    linkedinUrl: "",
    urgency: "",
    source: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Required";
    if (!formData.whatsAppNumber.trim()) {
      newErrors.whatsAppNumber = "Required";
    } else if (formData.whatsAppNumber.trim().length < 7) {
      newErrors.whatsAppNumber = "Invalid number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Required";
    } else if (!formData.email.includes("@") || !formData.email.includes(".")) {
      newErrors.email = "Invalid email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.currentRole.trim()) newErrors.currentRole = "Required";
    if (!formData.experienceBand) newErrors.experienceBand = "Required";
    if (!formData.city.trim()) newErrors.city = "Required";
    if (!formData.primarySkill) newErrors.primarySkill = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedPersona,
          ...formData,
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        onError();
      }
    } catch {
      onError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "w-full form-input rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none";

  const labelClassName = "block text-sm font-medium text-white/70 mb-2";

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`flex-1 h-1 rounded-full ${step >= 1 ? "bg-orange-500" : "bg-white/10"}`} />
        <div className={`flex-1 h-1 rounded-full ${step >= 2 ? "bg-orange-500" : "bg-white/10"}`} />
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in-up">
            <h3 className="text-xl font-semibold mb-6">Let&apos;s start with the basics</h3>

            <div>
              <label htmlFor="fullName" className={labelClassName}>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="Your full name"
              />
              {errors.fullName && (
                <p className="text-xs text-red-400 mt-1.5">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="whatsAppNumber" className={labelClassName}>
                WhatsApp Number
              </label>
              <input
                type="text"
                id="whatsAppNumber"
                name="whatsAppNumber"
                value={formData.whatsAppNumber}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="+91 98765 43210"
              />
              {errors.whatsAppNumber && (
                <p className="text-xs text-red-400 mt-1.5">{errors.whatsAppNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className={labelClassName}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="linkedinUrl" className={labelClassName}>
                LinkedIn Profile <span className="text-white/40">(optional)</span>
              </label>
              <input
                type="text"
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="linkedin.com/in/yourprofile"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-6 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 btn-primary px-6 py-3 rounded-xl text-sm font-semibold text-white"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Professional Info */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in-up">
            <h3 className="text-xl font-semibold mb-6">Tell me about your work</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="currentRole" className={labelClassName}>
                  Current Role
                </label>
                <input
                  type="text"
                  id="currentRole"
                  name="currentRole"
                  value={formData.currentRole}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="e.g. Senior Engineer"
                />
                {errors.currentRole && (
                  <p className="text-xs text-red-400 mt-1.5">{errors.currentRole}</p>
                )}
              </div>

              <div>
                <label htmlFor="currentCompany" className={labelClassName}>
                  Company <span className="text-white/40">(optional)</span>
                </label>
                <input
                  type="text"
                  id="currentCompany"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="e.g. Acme Corp"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="experienceBand" className={labelClassName}>
                  Experience
                </label>
                <select
                  id="experienceBand"
                  name="experienceBand"
                  value={formData.experienceBand}
                  onChange={handleInputChange}
                  className={inputClassName}
                >
                  <option value="">Select</option>
                  <option value="0-1">0–1 years</option>
                  <option value="1-3">1–3 years</option>
                  <option value="3-5">3–5 years</option>
                  <option value="5-8">5–8 years</option>
                  <option value="8+">8+ years</option>
                </select>
                {errors.experienceBand && (
                  <p className="text-xs text-red-400 mt-1.5">{errors.experienceBand}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className={labelClassName}>
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="e.g. Bengaluru"
                />
                {errors.city && (
                  <p className="text-xs text-red-400 mt-1.5">{errors.city}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="primarySkill" className={labelClassName}>
                Primary Skill Area
              </label>
              <select
                id="primarySkill"
                name="primarySkill"
                value={formData.primarySkill}
                onChange={handleInputChange}
                className={inputClassName}
              >
                <option value="">Select skill area</option>
                <option value="software-backend">Software / Backend</option>
                <option value="frontend-web">Frontend / Web</option>
                <option value="data-ml">Data / ML</option>
                <option value="product-management">Product Management</option>
                <option value="design">Design (UI/UX)</option>
                <option value="sales">Sales</option>
                <option value="marketing-growth">Marketing / Growth</option>
                <option value="operations-support">Operations / Support</option>
                <option value="other">Other</option>
              </select>
              {errors.primarySkill && (
                <p className="text-xs text-red-400 mt-1.5">{errors.primarySkill}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="currentCTC" className={labelClassName}>
                  Current CTC <span className="text-white/40">(optional)</span>
                </label>
                <input
                  type="text"
                  id="currentCTC"
                  name="currentCTC"
                  value={formData.currentCTC}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="e.g. ₹18 LPA"
                />
              </div>

              <div>
                <label htmlFor="noticePeriod" className={labelClassName}>
                  Notice Period <span className="text-white/40">(optional)</span>
                </label>
                <select
                  id="noticePeriod"
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleInputChange}
                  className={inputClassName}
                >
                  <option value="">Select</option>
                  <option value="serving">Serving notice</option>
                  <option value="lt-30">&lt; 30 days</option>
                  <option value="30-60">30–60 days</option>
                  <option value="gt-60">&gt; 60 days</option>
                  <option value="na">Not applicable</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Get jobs on WhatsApp"
                )}
              </button>
            </div>

            <p className="text-xs text-white/40 text-center pt-2">
              By submitting, you agree to receive job updates from Tal on WhatsApp.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
