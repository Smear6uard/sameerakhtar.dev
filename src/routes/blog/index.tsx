import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@/components/ui/Link";
import { Reveal } from "@/components/ui/Reveal";
import { blogPosts, formatBlogDate } from "@/lib/blog-posts";
import { seo } from "@/lib/seo";
import { site } from "@/lib/site";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      ...seo({
        title: "Writing — Sameer Akhtar",
        description:
          "Notes from Sameer Akhtar on shipping AI products, cost engineering, and building systems that hold up.",
        url: `${site.url}/blog`,
      }),
    ],
    links: [{ rel: "canonical", href: `${site.url}/blog` }],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="wrap pt-10 pb-8 md:pt-16">
      <Reveal>
        <p className="eyebrow">Writing</p>
        <h1 className="display-xl mt-5 max-w-[16ch]">Notes from building things.</h1>
        <p className="lede mt-6 max-w-[54ch]">
          Longer write-ups on decisions that were not obvious at the time: model choice, cost, and
          the parts of a product nobody sees.
        </p>
      </Reveal>

      <ul className="mt-12">
        {blogPosts.map((post) => (
          <Reveal as="li" key={post.slug} className="hairline">
            <Link
              href={`/blog/${post.slug}`}
              className="group grid gap-3 py-8 md:grid-cols-12 md:gap-10"
            >
              <p className="font-mono text-xs tracking-[0.08em] text-ink-3 uppercase md:col-span-3">
                {formatBlogDate(post.date)} · {post.readingTime}
              </p>
              <div className="md:col-span-9">
                <h2 className="display-md transition-colors group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="mt-2 max-w-[60ch] text-ink-2">{post.description}</p>
                <p className="mt-3 font-mono text-xs text-ink-3">{post.tags.join(" · ")}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
