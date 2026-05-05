// Server route emitting sitemap.xml — equivalent of `src/app/sitemap.ts`.
// Bracket-escaped filename `sitemap[.]xml.ts` → URL `/sitemap.xml`.

import { createFileRoute } from "@tanstack/react-router";
import { blogPosts } from "@/lib/blog-posts";
import { getAllProjectSlugs } from "@/lib/projects";

const BASE_URL = "https://sameerakhtar.dev";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const currentDate = new Date().toISOString();

        const entries: { url: string; lastmod: string; changefreq: string; priority: string }[] = [
          {
            url: BASE_URL,
            lastmod: currentDate,
            changefreq: "weekly",
            priority: "1.0",
          },
          {
            url: `${BASE_URL}/blog`,
            lastmod: currentDate,
            changefreq: "weekly",
            priority: "0.8",
          },
          ...blogPosts.map((post) => ({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastmod: post.date,
            changefreq: "monthly",
            priority: "0.7",
          })),
          ...getAllProjectSlugs().map((slug) => ({
            url: `${BASE_URL}/work/${slug}`,
            lastmod: currentDate,
            changefreq: "monthly",
            priority: "0.9",
          })),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${escapeXml(e.url)}</loc>
    <lastmod>${escapeXml(e.lastmod)}</lastmod>
    <changefreq>${escapeXml(e.changefreq)}</changefreq>
    <priority>${escapeXml(e.priority)}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(body, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
