import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
// import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Shakila Praween | Software Engineer",
  description:
    "Software Engineering undergraduate at NSBM Green University. Building fullstack & mobile applications with React, Next.js, Flutter and Java EE.",
};

// ✅ Viewport export — Next.js 13+ recommended way (not in metadata)
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
