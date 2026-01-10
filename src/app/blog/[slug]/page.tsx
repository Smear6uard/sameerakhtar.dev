import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getBlogPost, getAllBlogSlugs, blogPosts } from "@/lib/blog-posts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://sameerakhtar.dev/blog/${slug}`,
    },
    openGraph: {
      title: `${post.title} | Sameer Akhtar`,
      description: post.description,
      url: `https://sameerakhtar.dev/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      authors: ["Sameer Akhtar"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Find adjacent posts for navigation
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <div className="pt-32 pb-20 px-6">
      <article className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="text-sm text-text-muted hover:text-accent transition-colors mb-8 inline-block"
        >
          ← back to blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <time className="font-mono text-sm text-text-muted">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span className="text-text-muted/40">·</span>
            <span className="font-mono text-sm text-text-muted">
              {post.readingTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight mb-6">
            {post.title}
          </h1>

          <p className="text-xl text-text-secondary">{post.description}</p>

          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs text-accent/70 bg-accent/10 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
          <BlogContent content={post.content} />
        </div>

        {/* Author */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-accent font-bold text-lg">S</span>
            </div>
            <div>
              <p className="font-semibold text-text-primary">Sameer Akhtar</p>
              <p className="text-sm text-text-muted">
                Software Engineer & Founder
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {(prevPost || nextPost) && (
          <nav className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group text-left"
              >
                <span className="text-xs font-mono text-text-muted mb-1 block">
                  ← Previous
                </span>
                <span className="text-text-primary group-hover:text-accent transition-colors">
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group text-right"
              >
                <span className="text-xs font-mono text-text-muted mb-1 block">
                  Next →
                </span>
                <span className="text-text-primary group-hover:text-accent transition-colors">
                  {nextPost.title}
                </span>
              </Link>
            )}
          </nav>
        )}
      </article>
    </div>
  );
}

// Simple markdown-like rendering for blog content
function BlogContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={key++} className="my-6">
          {language && (
            <div className="bg-[#1a1a2e] border border-white/10 border-b-0 rounded-t-lg px-4 py-2">
              <span className="font-mono text-xs text-text-muted">{language}</span>
            </div>
          )}
          <pre className={`bg-[#0d1117] border border-white/10 ${language ? 'rounded-b-lg border-t-0' : 'rounded-lg'} p-4 overflow-x-auto`}>
            <code className="font-mono text-sm text-text-secondary">
              {codeLines.join("\n")}
            </code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // Heading 2
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={key++}
          className="text-2xl font-bold text-text-primary mt-12 mb-4"
        >
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // Heading 3
    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={key++}
          className="text-xl font-semibold text-text-primary mt-8 mb-3"
        >
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      elements.push(
        <hr key={key++} className="my-8 border-white/10" />
      );
      i++;
      continue;
    }

    // List item
    if (line.startsWith("- ")) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="my-4 space-y-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-text-secondary flex items-start gap-2">
              <span className="text-accent mt-1.5">•</span>
              <span><InlineFormatting text={item} /></span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Bold paragraph starting with **
    if (line.startsWith("**") && line.includes("**", 2)) {
      elements.push(
        <p key={key++} className="text-text-secondary my-4 leading-relaxed">
          <InlineFormatting text={line} />
        </p>
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={key++} className="text-text-secondary my-4 leading-relaxed">
        <InlineFormatting text={line} />
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

// Handle inline formatting like **bold**, `code`, and [links](url)
function InlineFormatting({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Inline code
    const codeMatch = remaining.match(/`([^`]+)`/);
    // Link
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

    // Find earliest match
    const matches = [
      boldMatch ? { type: "bold", match: boldMatch, index: boldMatch.index! } : null,
      codeMatch ? { type: "code", match: codeMatch, index: codeMatch.index! } : null,
      linkMatch ? { type: "link", match: linkMatch, index: linkMatch.index! } : null,
    ].filter(Boolean) as { type: string; match: RegExpMatchArray; index: number }[];

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const earliest = matches[0];

    // Add text before match
    if (earliest.index > 0) {
      parts.push(remaining.slice(0, earliest.index));
    }

    // Process match
    if (earliest.type === "bold") {
      parts.push(
        <strong key={key++} className="text-text-primary font-semibold">
          {earliest.match[1]}
        </strong>
      );
      remaining = remaining.slice(earliest.index + earliest.match[0].length);
    } else if (earliest.type === "code") {
      parts.push(
        <code
          key={key++}
          className="font-mono text-sm bg-white/5 text-accent px-1.5 py-0.5 rounded"
        >
          {earliest.match[1]}
        </code>
      );
      remaining = remaining.slice(earliest.index + earliest.match[0].length);
    } else if (earliest.type === "link") {
      parts.push(
        <a
          key={key++}
          href={earliest.match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          {earliest.match[1]}
        </a>
      );
      remaining = remaining.slice(earliest.index + earliest.match[0].length);
    }
  }

  return <>{parts}</>;
}
