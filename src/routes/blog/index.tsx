import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@/components/ui/Link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/fx/SectionTitle";
import { Spotlight } from "@/components/fx/Spotlight";
import { blogPosts, formatBlogDate } from "@/lib/blog-posts";
import { seo } from "@/lib/seo";
import { site } from "@/lib/site";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      ...seo({
        title: "Blog | Sameer Akhtar",
        description:
          "Thoughts on software engineering, AI development, startups, and building products, by Sameer Akhtar.",
        url: `${site.url}/blog`,
      }),
    ],
    links: [{ rel: "canonical", href: `${site.url}/blog` }],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="wrap relative z-10 pt-12 pb-8 md:pt-20">
      <Reveal>
        <SectionTitle text="blog" />
        <h1 className="display-lg mt-4">Writing</h1>
        <p className="lede mt-4 max-w-[52ch]">
          Thoughts on software engineering, AI, and building products.
        </p>
      </Reveal>

      <ul className="mt-10 grid gap-5">
        {blogPosts.map((post, i) => (
          <Reveal as="li" key={post.slug} delay={i * 0.06}>
            <Spotlight className="group">
              <Link href={`/blog/${post.slug}`} className="block p-6 md:p-7">
                <p className="font-mono text-xs text-ink-3">
                  {formatBlogDate(post.date)} · {post.readingTime}
                </p>
                <h2 className="mt-3 text-xl font-bold text-ink transition-colors group-hover:text-accent md:text-2xl">
                  {post.title}
                </h2>
                <p className="mt-2 max-w-[60ch] text-ink-2">{post.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="pill pill-accent font-mono text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </Spotlight>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
