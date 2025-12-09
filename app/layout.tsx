import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tal - Your Job-Fixing Agent on WhatsApp",
  description:
    "One serious, relevant job a day on WhatsApp. Escape bad hikes, toxic teams, and lowball offers with Tal.",
  openGraph: {
    title: "Tal - Your Job-Fixing Agent on WhatsApp",
    description: "One serious, relevant job a day on WhatsApp. Escape bad hikes, toxic teams, and lowball offers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tal - Your Job-Fixing Agent on WhatsApp",
    description: "One serious, relevant job a day on WhatsApp. Escape bad hikes, toxic teams, and lowball offers.",
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
