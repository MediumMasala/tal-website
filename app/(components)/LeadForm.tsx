"use client";

import { useState, FormEvent } from "react";

interface LeadFormProps {
  selectedPersona: string;
  prefill?: {
    name?: string;
    phone?: string;
    company?: string;
  } | null;
  onSuccess: () => void;
  onError: () => void;
}

interface FormErrors {
  [key: string]: string;
}

export default function LeadForm({
  selectedPersona,
  prefill,
  onSuccess,
  onError,
}: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    fullName: prefill?.name || "",
    whatsAppNumber: prefill?.phone || "",
    currentRole: "",
    currentCompany: prefill?.company || "",
    experienceBand: "",
    city: "",
    primarySkill: "",
    currentCTC: "",
    targetCTC: "",
    noticePeriod: "",
    linkedinUrl: "",
    email: "",
    urgency: "",
    source: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Name is required";
    }
    if (!formData.whatsAppNumber.trim()) {
      newErrors.whatsAppNumber = "WhatsApp number is required";
    } else if (formData.whatsAppNumber.trim().length < 7) {
      newErrors.whatsAppNumber = "Please enter a valid phone number";
    }
    if (!formData.currentRole.trim()) {
      newErrors.currentRole = "Current role is required";
    }
    if (!formData.experienceBand) {
      newErrors.experienceBand = "Experience is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.primarySkill) {
      newErrors.primarySkill = "Primary skill is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!formData.email.includes("@") || !formData.email.includes(".")) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.urgency) {
      newErrors.urgency = "Please select urgency";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

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
    "w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 placeholder:text-slate-500";

  const labelClassName = "block text-sm font-medium text-slate-300 mb-1.5";

  const errorClassName = "text-xs text-red-400 mt-1";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className={labelClassName}>
            Full Name <span className="text-red-400">*</span>
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
            <p className={errorClassName}>{errors.fullName}</p>
          )}
        </div>

        {/* WhatsApp Number */}
        <div>
          <label htmlFor="whatsAppNumber" className={labelClassName}>
            WhatsApp Number <span className="text-red-400">*</span>
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
            <p className={errorClassName}>{errors.whatsAppNumber}</p>
          )}
        </div>

        {/* Current Role */}
        <div>
          <label htmlFor="currentRole" className={labelClassName}>
            Current Role / Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="currentRole"
            name="currentRole"
            value={formData.currentRole}
            onChange={handleInputChange}
            className={inputClassName}
            placeholder="e.g. Senior Software Engineer"
          />
          {errors.currentRole && (
            <p className={errorClassName}>{errors.currentRole}</p>
          )}
        </div>

        {/* Current Company */}
        <div>
          <label htmlFor="currentCompany" className={labelClassName}>
            Current Company
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

        {/* Years of Experience */}
        <div>
          <label htmlFor="experienceBand" className={labelClassName}>
            Years of Experience <span className="text-red-400">*</span>
          </label>
          <select
            id="experienceBand"
            name="experienceBand"
            value={formData.experienceBand}
            onChange={handleInputChange}
            className={inputClassName}
          >
            <option value="">Select experience</option>
            <option value="0-1">0–1 years</option>
            <option value="1-3">1–3 years</option>
            <option value="3-5">3–5 years</option>
            <option value="5-8">5–8 years</option>
            <option value="8+">8+ years</option>
          </select>
          {errors.experienceBand && (
            <p className={errorClassName}>{errors.experienceBand}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className={labelClassName}>
            City <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={inputClassName}
            placeholder="Bengaluru, Mumbai, Delhi NCR, ..."
          />
          {errors.city && <p className={errorClassName}>{errors.city}</p>}
        </div>

        {/* Primary Skill */}
        <div>
          <label htmlFor="primarySkill" className={labelClassName}>
            Primary Skill Area <span className="text-red-400">*</span>
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
            <p className={errorClassName}>{errors.primarySkill}</p>
          )}
        </div>

        {/* Current CTC */}
        <div>
          <label htmlFor="currentCTC" className={labelClassName}>
            Current CTC
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

        {/* Target CTC */}
        <div>
          <label htmlFor="targetCTC" className={labelClassName}>
            Target CTC Range
          </label>
          <input
            type="text"
            id="targetCTC"
            name="targetCTC"
            value={formData.targetCTC}
            onChange={handleInputChange}
            className={inputClassName}
            placeholder="e.g. ₹24–28 LPA"
          />
        </div>

        {/* Notice Period */}
        <div>
          <label htmlFor="noticePeriod" className={labelClassName}>
            Notice Period
          </label>
          <select
            id="noticePeriod"
            name="noticePeriod"
            value={formData.noticePeriod}
            onChange={handleInputChange}
            className={inputClassName}
          >
            <option value="">Select notice period</option>
            <option value="serving">Serving notice</option>
            <option value="lt-30">&lt; 30 days</option>
            <option value="30-60">30–60 days</option>
            <option value="gt-60">&gt; 60 days</option>
            <option value="na">Not applicable</option>
          </select>
        </div>

        {/* LinkedIn */}
        <div>
          <label htmlFor="linkedinUrl" className={labelClassName}>
            LinkedIn Profile URL
          </label>
          <input
            type="text"
            id="linkedinUrl"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleInputChange}
            className={inputClassName}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelClassName}>
            Email <span className="text-red-400">*</span>
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
          {errors.email && <p className={errorClassName}>{errors.email}</p>}
        </div>

        {/* Source */}
        <div>
          <label htmlFor="source" className={labelClassName}>
            How did you hear about Tal?
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            className={inputClassName}
          >
            <option value="">Select option</option>
            <option value="friend">Friend / colleague</option>
            <option value="whatsapp">WhatsApp group</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter / X</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Urgency - Full width */}
      <div className="mt-4">
        <label className={labelClassName}>
          How urgent is your job search? <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-col gap-2 mt-2">
          {[
            { value: "exploring", label: "Just exploring" },
            { value: "3-months", label: "Open to switch in next 3 months" },
            { value: "asap", label: "Need something ASAP" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="urgency"
                value={option.value}
                checked={formData.urgency === option.value}
                onChange={handleInputChange}
                className="w-4 h-4 text-orange-500 bg-slate-800 border-slate-600 focus:ring-orange-500 focus:ring-2"
              />
              <span className="text-sm text-slate-300">{option.label}</span>
            </label>
          ))}
        </div>
        {errors.urgency && <p className={errorClassName}>{errors.urgency}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium bg-orange-500 text-slate-950 hover:bg-orange-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-slate-950"
      >
        {isSubmitting ? "Saving..." : "Get jobs on WhatsApp"}
      </button>

      {/* Legal Text */}
      <p className="mt-3 text-xs text-slate-500 text-center">
        By submitting, you agree to receive job updates and career nudges from
        Tal on WhatsApp. No spam.
      </p>
    </form>
  );
}
