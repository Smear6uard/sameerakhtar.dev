import { createFileRoute, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArticleJsonLd } from "@/components/JsonLd";
import { ReadingProgress } from "@/components/case-study/ReadingProgress";
import { Link } from "@/components/ui/Link";
import { Reveal } from "@/components/ui/Reveal";
import { type BlogPost, blogPosts, formatBlogDate, getBlogPost } from "@/lib/blog-posts";
import { seo } from "@/lib/seo";
import { site } from "@/lib/site";

interface LoaderData {
  post: BlogPost;
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }): LoaderData => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    const index = blogPosts.findIndex((p) => p.slug === params.slug);
    return {
      post,
      prevPost: index > 0 ? blogPosts[index - 1] : null,
      nextPost: index < blogPosts.length - 1 ? blogPosts[index + 1] : null,
    };
  },
  head: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) return { meta: [{ title: "Not found — Sameer Akhtar" }] };
    return {
      meta: [
        ...seo({
          title: `${post.title} | Sameer Akhtar`,
          description: post.description,
          type: "article",
          url: `${site.url}/blog/${params.slug}`,
        }),
      ],
      links: [{ rel: "canonical", href: `${site.url}/blog/${params.slug}` }],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post, prevPost, nextPost } = Route.useLoaderData();

  return (
    <>
      <ReadingProgress />
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        url={`${site.url}/blog/${post.slug}`}
        datePublished={post.date}
      />
      <article className="wrap relative z-10 pt-12 pb-8 md:pt-16">
        <Reveal>
          <Link href="/blog" className="link-quiet group inline-flex items-center gap-1 text-sm">
            <span className="transition-transform group-hover:-translate-x-1">←</span> back to blog
          </Link>
          <p className="eyebrow mt-8">
            {formatBlogDate(post.date, "long")} · {post.readingTime}
          </p>
          <h1 className="display-lg mt-4 max-w-[22ch]">{post.title}</h1>
          <p className="lede mt-5 max-w-[58ch]">{post.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="pill pill-accent font-mono text-[11px]">
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="prose-site mt-14 max-w-[68ch]">
          <BlogContent content={post.content} />
        </div>

        <Reveal className="hairline mt-16 flex items-center gap-4 pt-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-lg font-bold text-accent">
            S
          </span>
          <span>
            <span className="block font-medium text-ink">Sameer Akhtar</span>
            <span className="block text-sm text-ink-3">Software Engineer &amp; Founder</span>
          </span>
        </Reveal>

        {(prevPost || nextPost) && (
          <nav className="hairline mt-10 grid grid-cols-2 gap-4 pt-8 text-sm" aria-label="Posts">
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`} className="group">
                <span className="eyebrow">← Previous</span>
                <span className="mt-1 block text-ink transition-colors group-hover:text-accent">
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {nextPost && (
              <Link href={`/blog/${nextPost.slug}`} className="group text-right">
                <span className="eyebrow">Next →</span>
                <span className="mt-1 block text-ink transition-colors group-hover:text-accent">
                  {nextPost.title}
                </span>
              </Link>
            )}
          </nav>
        )}
      </article>
    </>
  );
}

/** Minimal markdown renderer for the handful of constructs the posts use. */
function BlogContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <figure key={key++} className="my-6 overflow-hidden rounded-xl border border-line bg-panel">
          {language && (
            <figcaption className="border-b border-white/10 px-4 py-2 font-mono text-[11px] text-white/55">
              {language}
            </figcaption>
          )}
          <pre>
            <code>{codeLines.join("\n")}</code>
          </pre>
        </figure>,
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++}>{line.slice(3)}</h2>);
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      elements.push(<h3 key={key++}>{line.slice(4)}</h3>);
      i++;
      continue;
    }
    if (line.trim() === "---") {
      elements.push(<hr key={key++} />);
      i++;
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++}>
          {items.map((item, idx) => (
            <li key={idx}>
              <Inline text={item} />
            </li>
          ))}
        </ul>,
      );
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }

    elements.push(
      <p key={key++}>
        <Inline text={line} />
      </p>,
    );
    i++;
  }

  return <>{elements}</>;
}

function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const candidates = [
      { type: "bold", match: remaining.match(/\*\*(.+?)\*\*/) },
      { type: "italic", match: remaining.match(/(?<!\*)\*(?!\*)([^*]+?)\*(?!\*)/) },
      { type: "code", match: remaining.match(/`([^`]+)`/) },
      { type: "link", match: remaining.match(/\[([^\]]+)\]\(([^)]+)\)/) },
    ].filter((c): c is { type: string; match: RegExpMatchArray } => c.match !== null);

    if (candidates.length === 0) {
      parts.push(remaining);
      break;
    }

    candidates.sort((a, b) => (a.match.index ?? 0) - (b.match.index ?? 0));
    const first = candidates[0];
    const index = first.match.index ?? 0;
    if (index > 0) parts.push(remaining.slice(0, index));

    if (first.type === "bold") {
      parts.push(<strong key={key++}>{first.match[1]}</strong>);
    } else if (first.type === "italic") {
      parts.push(<em key={key++}>{first.match[1]}</em>);
    } else if (first.type === "code") {
      parts.push(<code key={key++}>{first.match[1]}</code>);
    } else {
      parts.push(
        <a key={key++} href={first.match[2]} target="_blank" rel="noopener noreferrer">
          {first.match[1]}
        </a>,
      );
    }
    remaining = remaining.slice(index + first.match[0].length);
  }

  return <>{parts}</>;
}
