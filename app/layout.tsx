import type { Metadata } from "next";
import "./globals.css";
import { companyConfig } from "@/lib/companyConfig";

export const metadata: Metadata = {
  title: `Tal for ${companyConfig.name} - Find Better Jobs on WhatsApp`,
  description: `For ${companyConfig.name} employees: Tal is your job-fixing agent on WhatsApp. Get 1 serious, relevant job a day - no spam, no random HR calls.`,
  openGraph: {
    title: `Tal for ${companyConfig.name} - Find Better Jobs on WhatsApp`,
    description: `For ${companyConfig.name} employees: Get 1 serious, relevant job a day on WhatsApp with Tal.`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Tal for ${companyConfig.name} - Find Better Jobs on WhatsApp`,
    description: `For ${companyConfig.name} employees: Get 1 serious, relevant job a day on WhatsApp with Tal.`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
