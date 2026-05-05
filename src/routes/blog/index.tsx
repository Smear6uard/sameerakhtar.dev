// Blog index — equivalent of `src/app/blog/page.tsx` in the old Next.js app.

import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@/components/ui/Link";
import { blogPosts, formatBlogDate } from "@/lib/blog-posts";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      ...seo({
        title: "Blog | Sameer Akhtar",
        description:
          "Thoughts on software engineering, AI development, startups, and technology by Sameer Akhtar.",
        url: "https://sameerakhtar.dev/blog",
      }),
    ],
    links: [{ rel: "canonical", href: "https://sameerakhtar.dev/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-sm text-text-muted hover:text-accent transition-colors mb-8 inline-block"
        >
          ← back home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight">Blog</h1>

        <p className="mt-6 text-xl text-text-secondary">
          Thoughts on software engineering, AI, and building products.
        </p>

        <div className="mt-16 space-y-6">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="border border-white/10 rounded-lg p-6 hover:border-accent/30 hover:bg-white/[0.02] transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <time className="font-mono text-xs text-text-muted">
                    {formatBlogDate(post.date)}
                  </time>
                  <span className="text-text-muted/40">·</span>
                  <span className="font-mono text-xs text-text-muted">{post.readingTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="text-text-secondary mb-4">{post.description}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs text-accent/70 bg-accent/10 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <p className="mt-12 text-center text-text-muted">No posts yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
}
