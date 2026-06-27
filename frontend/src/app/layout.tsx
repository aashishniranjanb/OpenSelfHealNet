import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OpenSelfHealNet — Interactive Network Resilience Simulator",
  description:
    "An open-source interactive digital twin that visualizes how communication networks operate, fail, recover, and evolve using open-source technologies.",
  keywords: [
    "network simulation",
    "self-healing networks",
    "digital twin",
    "open source",
    "communication infrastructure",
    "mesh networking",
    "5G",
    "telecom",
    "OpenSelfHealNet",
  ],
  authors: [{ name: "OpenSelfHealNet" }],
  openGraph: {
    title: "OpenSelfHealNet — Interactive Network Resilience Simulator",
    description:
      "Experience how communication networks work, fail, and recover through an interactive digital twin.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
