import { notFound } from "next/navigation";
import Link from "next/link";

const projects: Record<
  string,
  {
    title: string;
    subtitle: string;
    timeline: string;
    role: string;
    stack: string[];
    github?: string;
    live?: string;
    metrics: { label: string; value: string }[];
    content: string;
  }
> = {
  styleum: {
    title: "Styleum",
    subtitle: "AI-powered personal styling platform helping users discover their unique style",
    timeline: "Dec 2024 – Present",
    role: "Founder & Lead Developer",
    stack: ["Next.js", "TypeScript", "OpenAI", "Supabase", "Stripe", "Vercel"],
    live: "https://styleum.co",
    metrics: [
      { label: "Status", value: "Building" },
      { label: "Stack", value: "Full-Stack" },
      { label: "AI", value: "Integrated" },
      { label: "Platform", value: "SaaS" },
    ],
    content: `
## The Vision

Fashion is personal, but finding your style shouldn't require a personal stylist. I'm building Styleum to democratize personal styling through AI—giving everyone access to curated, personalized fashion recommendations that match their unique preferences, body type, and lifestyle.

## Building From Scratch

### The Technical Foundation

As a solo founder, I'm architecting every layer of the stack:

- **Frontend**: Next.js 14 with App Router, TypeScript for type safety, and Tailwind CSS for rapid UI development
- **AI Integration**: OpenAI's GPT-4 for style analysis and recommendations, with custom prompts optimized for fashion context
- **Backend**: Supabase for authentication, database, and real-time features
- **Payments**: Stripe integration for subscription management
- **Deployment**: Vercel for seamless CI/CD and edge functions

### Key Technical Decisions

**Next.js over alternatives**: Server components reduce client bundle size significantly, and the App Router's parallel routes enable complex dashboard layouts without sacrificing performance.

**Supabase over Firebase**: Row-level security policies provide fine-grained access control out of the box. The PostgreSQL foundation means complex queries when I need them.

**OpenAI with custom fine-tuning**: Starting with GPT-4 for style recommendations, with plans to fine-tune on fashion-specific datasets for better accuracy.

## Current Progress

Building in public and iterating fast. The MVP includes:
- User onboarding flow with style preferences
- AI-powered style profile generation
- Curated outfit recommendations
- Subscription-based access model

## What I'm Learning

Founding a startup is a different beast than engineering. I'm learning to balance product development with user research, marketing, and business strategy—all while shipping code daily. The technical challenges are real, but the hardest part is making the right product decisions with limited data.

## What's Next

- Expanding the AI model's fashion knowledge base
- Building social features for style inspiration
- Exploring partnerships with fashion brands
- Growing the beta user community
    `,
  },
  "ai-answer-engine": {
    title: "AI Answer Engine",
    subtitle: "Production AI-powered search processing 100+ URLs/hour",
    timeline: "Sep 2024 – Oct 2024",
    role: "Solo Developer",
    stack: ["Next.js", "Groq SDK", "Cheerio", "Puppeteer", "Vercel"],
    github: "https://github.com/Smear6uard/AI-Answer-Engine",
    live: "https://ai-answer-engine.vercel.app",
    metrics: [
      { label: "Accuracy", value: "98%" },
      { label: "Response Time", value: "<2s" },
      { label: "URLs/Hour", value: "100+" },
      { label: "Queries Handled", value: "1,000+" },
    ],
    content: `
## The Problem

Research is slow. Finding accurate answers across multiple sources requires opening dozens of tabs, reading through irrelevant content, and manually synthesizing information. I wanted to build a tool that could do this automatically with high accuracy.

## Technical Approach

### Architecture

The system works in three stages:

1. **Query Analysis**: Parse the user's question to identify key entities and intent
2. **Content Extraction**: Scrape relevant URLs using Cheerio for static content and Puppeteer for JavaScript-rendered pages
3. **AI Synthesis**: Use Groq SDK to generate accurate answers with source citations

### Key Decisions

**Groq over OpenAI**: Groq's inference speed (40% faster) was critical for keeping response times under 2 seconds. The accuracy tradeoff was minimal.

**Hybrid Scraping**: Most pages work with Cheerio (fast, lightweight), but I added Puppeteer fallback for SPAs and dynamic content. The router decides based on initial response headers.

**Aggressive Caching**: Implemented URL-level caching with 1-hour TTL to reduce redundant scraping and improve response times for repeated queries.

## Results

The system processes 100+ URLs per hour with 98% accuracy on factual queries. Deployed on Vercel, it handles 1,000+ queries with consistent sub-2-second response times.

## What I Learned

The biggest challenge was handling unreliable external URLs—timeouts, rate limits, malformed HTML. Building robust error handling and fallback strategies was more complex than the core AI integration.
    `,
  },
  "stock-exchange": {
    title: "Mock Stock Exchange Platform",
    subtitle: "Real-time matching engine handling 500+ trades per session",
    timeline: "Sep 2024 – Oct 2024",
    role: "Solo Developer",
    stack: ["Java", "JUnit", "Data Structures"],
    metrics: [
      { label: "Trades/Session", value: "500+" },
      { label: "Users Simulated", value: "100+" },
      { label: "Test Coverage", value: "100%" },
      { label: "Order Updates", value: "ms-level" },
    ],
    content: `
## The Problem

Understanding how real exchanges work requires hands-on implementation. I built a complete trading system to learn order matching algorithms, real-time data structures, and financial system design.

## Technical Approach

### Architecture

Modular class design with clear separation:

- **Price**: Immutable value object for currency handling
- **Order**: Buy/sell orders with quantity, price, and timestamp
- **Quote**: Real-time bid/ask spread tracking
- **OrderBook**: Price-time priority matching engine
- **Portfolio**: User holdings and balance validation

### Key Decisions

**Price-Time Priority**: Standard exchange matching algorithm. Orders at the same price execute in FIFO order.

**Millisecond Timestamps**: Critical for fair ordering. Used System.nanoTime() for sub-millisecond precision in testing.

**Immutable Orders**: Once placed, orders can only be canceled, not modified. Simplifies state management and audit trails.

## Results

The system handles 100+ concurrent users and 1,000+ trade events per session. The matching engine executes 500+ trades with millisecond-level order book updates. 50+ unit and integration tests provide 100% coverage.

## What I Learned

The hardest part was handling partial fills correctly—when a large order matches against multiple smaller orders at different prices. Edge cases in financial systems compound quickly.
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects[slug];

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Sameer Akhtar`,
    description: project.subtitle,
  };
}

function formatMarkdown(content: string): string {
  return content
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-text-primary mt-8 mb-4">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-text-primary mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>')
    .replace(/^- (.*)/gm, '<li class="ml-4 mb-2">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc list-inside mb-4">$&</ul>')
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
    .replace(/^(?!<)/gm, '')
    .trim();
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects[slug];

  if (!project) {
    notFound();
  }

  return (
    <article className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/#work"
          className="text-sm text-text-muted hover:text-accent transition-colors mb-8 inline-block"
        >
          ← back to projects
        </Link>

        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
            {project.title}
          </h1>
          <p className="mt-4 text-xl text-text-secondary">{project.subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-text-muted">Timeline</span>
              <p className="text-text-primary">{project.timeline}</p>
            </div>
            <div>
              <span className="text-text-muted">Role</span>
              <p className="text-text-primary">{project.role}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm font-mono text-accent bg-accent/10 rounded"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="p-4 border border-white/10 rounded-lg"
              >
                <p className="text-2xl font-bold text-accent">{metric.value}</p>
                <p className="text-sm text-text-muted">{metric.label}</p>
              </div>
            ))}
          </div>

          {(project.github || project.live) && (
            <div className="mt-8 flex gap-4">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent link-underline"
                >
                  View on GitHub →
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent link-underline"
                >
                  Live Demo
                </a>
              )}
            </div>
          )}
        </header>

        <div
          className="prose-custom text-text-secondary"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(project.content) }}
        />
      </div>
    </article>
  );
}
