export interface CompanyConfig {
  name: string;
  shortName: string;
  slug: string;
  employeeCountText: string;
  logoUrl: string;
  primaryColor: string;
  marketLabel: string;
  talWhatsAppLink: string;
}

export const companyConfig: CompanyConfig = {
  name: "Accenture",
  shortName: "Accenture",
  slug: "accenture",
  employeeCountText: "10,000+ Accenture employees already use Tal on WhatsApp",
  logoUrl: "/logos/accenture.svg",
  primaryColor: "#A100FF",
  marketLabel: "your market",
  talWhatsAppLink: "https://wa.me/919876543210?text=hi%20tal",
};

// Type for chat messages
export interface ChatMessage {
  id: string;
  from: "tal" | "user";
  text: string;
  createdAt: number;
}

// Chat step union type
export type ChatStep =
  | "intro"
  | "askIntent"
  | "askPhone"
  | "askName"
  | "askCompany"
  | "final";

// Lead payload interface
export interface LeadPayload {
  companySlug: string;
  companyName: string;
  whatsAppNumber: string;
  userName: string;
  userWorkplace: string;
  basicAsk: string;
  pageUrl: string;
  utm: { raw: string };
}

// AI Summary response
export interface AISummary {
  title: string;
  tags: string[];
}
