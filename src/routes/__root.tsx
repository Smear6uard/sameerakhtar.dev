// Root route — equivalent of `src/app/layout.tsx` in the old Next.js app.
// Wires up providers, persistent chrome (sidebar/mobile nav/footer), and
// renders matched child routes through `<Outlet />`.

/// <reference types="vite/client" />

import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

import globalsCss from "@/styles/globals.css?url";
import { seo } from "@/lib/seo";
import { ThemeProvider, themeFoucScript } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { GSAPProvider } from "@/components/providers/GSAPProvider";
import { PageTransition } from "@/components/providers/PageTransition";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { SideNav } from "@/components/SideNav";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/JsonLd";
import { ConsoleEasterEgg } from "@/components/ConsoleEasterEgg";
import { KonamiEasterEgg } from "@/components/KonamiEasterEgg";
import { NotFound } from "@/components/NotFound";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0a192f" },
      { name: "color-scheme", content: "dark" },
      { name: "format-detection", content: "telephone=no" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
      { name: "apple-mobile-web-app-title", content: "Sameer Akhtar" },
      { name: "author", content: "Sameer Akhtar" },
      ...seo({
        title: "Sameer Akhtar | Software Engineer & Founder",
        description:
          "Founder of Styleum — AI outfit generation at $0.002/call. Software engineering intern at Brunosoft. Math & CS at DePaul University. Previously Apple.",
        keywords:
          "Sameer Akhtar, Software Engineer, Full Stack Developer, Founder, Styleum, Startup Founder, AI Developer, iOS Developer, Swift Developer, React Developer, Next.js Developer, TypeScript, JavaScript, Python, Machine Learning, Computer Vision, DePaul University, Chicago Developer, Tech Entrepreneur",
        image: "https://sameerakhtar.dev/SameerAkhtar.dev-logo-navybg.jpg",
        url: "https://sameerakhtar.dev",
      }),
    ],
    links: [
      { rel: "stylesheet", href: globalsCss },
      { rel: "icon", type: "image/png", href: "/icon.png" },
      { rel: "apple-touch-icon", href: "/apple-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "canonical", href: "https://sameerakhtar.dev" },
    ],
    scripts: [
      // Inline FOUC-prevention script — runs synchronously before React
      // hydrates so the `data-theme` attribute is set from localStorage or
      // `prefers-color-scheme` and we never flash the wrong theme. Built
      // from constants in ThemeProvider; no runtime user input is interpolated.
      { children: themeFoucScript },
    ],
  }),
  notFoundComponent: () => (
    <RootDocument>
      <NotFound />
    </RootDocument>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
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
        <Scripts />
      </body>
    </html>
  );
}
