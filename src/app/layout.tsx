import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import { ScrollToTop } from "@/components/scroll-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sameerakhtar.dev'),
  title: "Sameer Akhtar | Computer Science Student & AI Developer",
  description: "Computer Science student at DePaul University with expertise in AI development, React, Next.js, and modern web technologies. Software Engineering Intern at BRUNOSOFT and Apple Specialist.",
  keywords: ["Sameer Akhtar", "Computer Science Student", "AI Developer", "Software Engineer", "React", "Next.js", "JavaScript", "Python", "DePaul University", "BRUNOSOFT", "Apple"],
  authors: [{ name: "Sameer Akhtar" }],
  creator: "Sameer Akhtar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sameerakhtar.dev",
    title: "Sameer Akhtar | Computer Science Student & AI Developer",
    description: "Computer Science student at DePaul University with expertise in AI development, React, Next.js, and modern web technologies. Software Engineering Intern at BRUNOSOFT and Apple Specialist.",
    siteName: "Sameer Akhtar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sameer Akhtar - Computer Science Student & AI Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sameer Akhtar",
    description: "Computer Science student at DePaul University with expertise in AI development, React, Next.js, and modern web technologies.",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        {children}
        <Footer />
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  );
}
