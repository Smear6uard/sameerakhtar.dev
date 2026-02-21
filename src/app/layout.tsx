import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SideNav } from "@/components/SideNav";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { JsonLd } from "@/components/JsonLd";
import { ConsoleEasterEgg } from "@/components/ConsoleEasterEgg";
import { KonamiEasterEgg } from "@/components/KonamiEasterEgg";
import { GSAPProvider } from "@/components/providers/GSAPProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { PageTransition } from "@/components/providers/PageTransition";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

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
  title: {
    default: "Sameer Akhtar | Software Engineer & Founder",
    template: "%s | Sameer Akhtar",
  },
  description:
    "Founder of Styleum — AI outfit generation at $0.002/call. Software engineering intern at Brunosoft. Math & CS at DePaul University. Previously Apple.",
  keywords: [
    "Sameer Akhtar",
    "Software Engineer",
    "Full Stack Developer",
    "Founder",
    "Styleum",
    "Startup Founder",
    "AI Developer",
    "iOS Developer",
    "Swift Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "JavaScript",
    "Python",
    "Machine Learning",
    "Computer Vision",
    "DePaul University",
    "Chicago Developer",
    "Tech Entrepreneur",
  ],
  authors: [{ name: "Sameer Akhtar", url: "https://sameerakhtar.dev" }],
  creator: "Sameer Akhtar",
  publisher: "Sameer Akhtar",
  category: "Technology",
  classification: "Portfolio",
  alternates: {
    canonical: "https://sameerakhtar.dev",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sameerakhtar.dev",
    title: "Sameer Akhtar | Software Engineer & Founder",
    description:
      "Founder of Styleum — AI outfit generation at $0.002/call. Software engineering intern at Brunosoft. Math & CS at DePaul. Previously Apple.",
    siteName: "Sameer Akhtar",
    images: [
      {
        url: "/SameerAkhtar.dev-logo-navybg.jpg",
        width: 1200,
        height: 630,
        alt: "Sameer Akhtar - Software Engineer & Founder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sameer Akhtar | Software Engineer & Founder",
    description:
      "Founder of Styleum — AI outfit generation at $0.002/call. Math & CS @ DePaul.",
    creator: "@sameerakhtar",
    site: "@sameerakhtar",
    images: [
      {
        url: "/SameerAkhtar.dev-logo-navybg.jpg",
        alt: "Sameer Akhtar - Software Engineer & Founder",
      },
    ],
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
  other: {
    "theme-color": "#0a192f",
    "color-scheme": "dark",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${satoshi.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Sameer Akhtar" />
        <JsonLd />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <ToastProvider>
            <ConsoleEasterEgg />
            <KonamiEasterEgg />
            <GSAPProvider>
              <SmoothScroll>
                <Cursor />
                <SideNav />
                <MobileNav />
                <main className="md:pl-[72px] pb-20 md:pb-0">
                  <PageTransition>{children}</PageTransition>
                </main>
                <Footer />
                <Analytics />
              </SmoothScroll>
            </GSAPProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
