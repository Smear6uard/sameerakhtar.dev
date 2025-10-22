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
  title: "Sameer Akhtar - Full Stack Developer & Software Engineer",
  description: "Portfolio showcasing my web development projects and skills",
  keywords: ["Sameer Akhtar", "Full Stack Developer", "Software Engineer", "React", "Next.js", "TypeScript", "Web Development"],
  authors: [{ name: "Sameer Akhtar" }],
  creator: "Sameer Akhtar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sameerakhtar.com",
    title: "Sameer Akhtar - Full Stack Developer & Software Engineer",
    description: "Portfolio showcasing my web development projects and skills",
    siteName: "Sameer Akhtar Portfolio",
    images: [
      {
        url: "/preview-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sameer Akhtar - Full Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sameer Akhtar - Full Stack Developer & Software Engineer",
    description: "Portfolio showcasing my web development projects and skills",
    creator: "@sameerakhtar",
    images: ["/preview-image.jpg"],
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
