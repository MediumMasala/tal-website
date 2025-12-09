import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tal - Your Job-Fixing Agent on WhatsApp",
  description:
    "One serious, relevant job a day on WhatsApp. Escape bad hikes, toxic teams, and lowball offers with Tal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 antialiased">{children}</body>
    </html>
  );
}
