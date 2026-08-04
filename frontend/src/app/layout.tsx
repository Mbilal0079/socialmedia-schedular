import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./landing.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PostPilot — Schedule Posts to Every Platform at Once",
  description:
    "Write once. PostPilot publishes to Twitter, LinkedIn, Facebook, and Instagram automatically at exactly the time you choose. Powered by BullMQ. Free to start.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: "#050816" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
