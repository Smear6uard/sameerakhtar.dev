import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";

const satoshi = localFont({
  src: [
    { path: "../fonts/Satoshi-Regular.woff2", weight: "400" },
    { path: "../fonts/Satoshi-Medium.woff2", weight: "500" },
    { path: "../fonts/Satoshi-Bold.woff2", weight: "700" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sameerakhtar.dev"),
  title: "Sameer Akhtar | Software Engineer & Founder",
  description:
    "Building Styleum, an AI-powered personal styling platform. Software engineering student at DePaul. Previously BRUNOSOFT, Apple.",
  keywords: [
    "Sameer Akhtar",
    "Software Engineer",
    "Founder",
    "Styleum",
    "Startup",
    "AI Developer",
    "React",
    "Next.js",
    "JavaScript",
    "Python",
    "DePaul University",
  ],
  authors: [{ name: "Sameer Akhtar" }],
  creator: "Sameer Akhtar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sameerakhtar.dev",
    title: "Sameer Akhtar | Software Engineer & Founder",
    description: "Building Styleum, an AI-powered personal styling platform.",
    siteName: "Sameer Akhtar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sameer Akhtar - Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sameer Akhtar | Software Engineer & Founder",
    description:
      "Building Styleum, an AI-powered personal styling platform. CS @ DePaul.",
    creator: "@sameerakhtar",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${satoshi.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        <SmoothScroll>
          <Cursor />
          <Navigation />
          <main>{children}</main>
          <Footer />
          <Analytics />
        </SmoothScroll>
      </body>
    </html>
  );
}
