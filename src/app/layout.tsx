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
  description: "Full-stack developer passionate about building scalable web applications that deliver exceptional user experiences and drive business growth.",
  keywords: ["Sameer Akhtar", "Full Stack Developer", "Software Engineer", "React", "Next.js", "TypeScript", "Web Development"],
  authors: [{ name: "Sameer Akhtar" }],
  creator: "Sameer Akhtar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sameerakhtar.com",
    title: "Sameer Akhtar - Full Stack Developer & Software Engineer",
    description: "Full-stack developer passionate about building scalable web applications that deliver exceptional user experiences and drive business growth.",
    siteName: "Sameer Akhtar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sameer Akhtar - Full Stack Developer & Software Engineer",
    description: "Full-stack developer passionate about building scalable web applications that deliver exceptional user experiences and drive business growth.",
    creator: "@sameerakhtar",
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
