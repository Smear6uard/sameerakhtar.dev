// Root route: document shell, providers, persistent chrome.

/// <reference types="vite/client" />

import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

import globalsCss from "@/styles/globals.css?url";
import { ThemeProvider, themeFoucScript } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { TopNav } from "@/components/TopNav";
import { Atmosphere } from "@/components/fx/Atmosphere";
import { Cursor } from "@/components/fx/Cursor";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/JsonLd";
import { ConsoleEasterEgg } from "@/components/ConsoleEasterEgg";
import { NotFound } from "@/components/NotFound";
import { site } from "@/lib/site";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "color-scheme", content: "dark light" },
      { name: "theme-color", content: "#0d1121" },
      { name: "format-detection", content: "telephone=no" },
      { name: "apple-mobile-web-app-title", content: site.name },
      { name: "author", content: site.name },
    ],
    links: [
      { rel: "stylesheet", href: globalsCss },
      { rel: "icon", type: "image/png", href: "/icon.png" },
      { rel: "apple-touch-icon", href: "/apple-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
    ],
    scripts: [
      // Sets `data-theme` before hydration so the first paint is correct.
      // Built from constants only; no runtime input is interpolated.
      { children: themeFoucScript },
    ],
  }),
  notFoundComponent: () => <NotFound />,
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
            <Atmosphere />
            <Cursor />
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-elev focus:px-4 focus:py-2 focus:text-ink"
            >
              Skip to content
            </a>
            <TopNav />
            <main id="main" className="relative">
              {children}
            </main>
            <Footer />
            <Analytics />
          </ToastProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
