import Link from "next/link";

export const metadata = {
  title: "Blog | Sameer Akhtar",
  description: "Thoughts on software engineering, AI, and technology.",
};

const upcomingPosts = [
  {
    title: "Building Styleum: Designing an AI Pipeline at $0.002/call",
    description:
      "How I optimized OpenAI API costs while building a personal styling platform that delivers real-time recommendations.",
    status: "Coming January 2025",
  },
  {
    title: "How I Scaled the AI Answer Engine to 100+ URLs/hour",
    description:
      "Deep dive into hybrid scraping, caching strategies, and achieving 98% accuracy with Groq SDK.",
    status: "Coming January 2025",
  },
  {
    title: "Lessons from Migrating 100+ Angular Components",
    description:
      "What I learned leading an enterprise migration from AngularJS to Angular 17+ at BRUNOSOFT.",
    status: "Coming January 2025",
  },
];

export default function BlogPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-sm text-text-muted hover:text-accent transition-colors mb-8 inline-block"
        >
          ← back home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
          Blog
        </h1>

        <p className="mt-6 text-xl text-text-secondary">
          Thoughts on software engineering, AI, and building products.
        </p>

        <div className="mt-16 space-y-6">
          {upcomingPosts.map((post) => (
            <article
              key={post.title}
              className="border border-white/10 rounded-lg p-6 hover:border-accent/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs text-accent bg-accent/10 px-2 py-1 rounded">
                  {post.status}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                {post.title}
              </h2>
              <p className="text-text-secondary">{post.description}</p>
            </article>
          ))}
        </div>

        <p className="mt-12 text-center text-text-muted font-mono text-sm">
          Subscribe to get notified when new posts are published.
        </p>
      </div>
    </div>
  );
}
