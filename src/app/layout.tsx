import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
        url: "/favicon.ico",
        width: 512,
        height: 512,
        alt: "Sameer Akhtar - Computer Science Student & AI Developer",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Sameer Akhtar",
    description: "Computer Science student at DePaul University with expertise in AI development, React, Next.js, and modern web technologies.",
    creator: "@sameerakhtar",
    images: ["/favicon.ico"],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
               <ThemeProvider
                 attribute="class"
                 defaultTheme="dark"
                 enableSystem={false}
                 disableTransitionOnChange
               >
          <Navigation />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
