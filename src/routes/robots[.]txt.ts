// Server route emitting robots.txt — equivalent of `src/app/robots.ts`.
// Bracket-escaped filename `robots[.]txt.ts` → URL `/robots.txt`.

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://sameerakhtar.dev/sitemap.xml
Host: https://sameerakhtar.dev
`;
        return new Response(body, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      },
    },
  },
});
