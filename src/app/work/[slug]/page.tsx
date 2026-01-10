import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BreadcrumbJsonLd, ProjectJsonLd } from "@/components/JsonLd";
import { HeroImage } from "@/components/ui/HeroImage";

type ContentBlock =
  | { type: "text"; content: string }
  | { type: "heading"; level: 2 | 3; content: string }
  | { type: "code"; language: string; content: string; filename?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; content: string; variant?: "info" | "warning" | "success" };

interface Project {
  title: string;
  subtitle: string;
  timeline: string;
  role: string;
  stack: string[];
  github?: string;
  live?: string;
  heroImage?: string;
  metrics: { label: string; value: string }[];
  content: ContentBlock[];
}

const projects: Record<string, Project> = {
  styleum: {
    title: "Styleum",
    subtitle: "AI-powered personal styling platform helping users discover their unique style",
    timeline: "Dec 2024 – Present",
    role: "Founder & Lead Developer",
    stack: ["Next.js", "TypeScript", "OpenAI", "Supabase", "Stripe", "Vercel"],
    live: "https://styleum.co",
    heroImage: "/projects/styleum-hero.png",
    metrics: [
      { label: "Cost per Call", value: "$0.002" },
      { label: "Setup Time", value: "3 min" },
      { label: "Stack", value: "Full-Stack" },
      { label: "Status", value: "Building" },
    ],
    content: [
      { type: "heading", level: 2, content: "The Problem" },
      {
        type: "text",
        content:
          "Existing wardrobe apps are broken. They demand 20+ minutes of tedious photo uploads before you can even get started. Most users abandon before seeing any value. And the AI recommendations? Either too expensive to scale ($0.02+ per call) or too generic to be useful.",
      },
      { type: "heading", level: 2, content: "The Insight" },
      {
        type: "text",
        content:
          "Fashion is deeply personal, but the technology to deliver personalized styling doesn't need to be expensive. By routing simple requests through lightweight models and only escalating complex style decisions to GPT-4, I cut costs by 10x while maintaining quality.",
      },
      { type: "heading", level: 2, content: "The Solution" },
      { type: "heading", level: 3, content: "Hybrid AI Pipeline" },
      {
        type: "text",
        content:
          "The key innovation is a two-stage AI pipeline. Stage 1 uses a fast, cheap model to classify the request type and extract key parameters. Stage 2 routes only the complex requests to GPT-4 with rich context.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "ai-router.ts",
        content: `async function routeStyleRequest(request: StyleRequest) {
  // Stage 1: Fast classification (< 100ms, $0.0001)
  const classification = await classifyRequest(request);

  if (classification.complexity === 'simple') {
    // Handle with rules + lightweight model
    return generateSimpleRecommendation(request);
  }

  // Stage 2: Complex requests get full AI treatment
  return generateAIRecommendation(request, {
    model: 'gpt-4-turbo',
    context: buildRichContext(request.userProfile),
  });
}`,
      },
      { type: "heading", level: 3, content: "3-Minute Onboarding" },
      {
        type: "text",
        content:
          "Instead of demanding a full wardrobe photo shoot, Styleum starts with style preferences and body measurements. The AI builds your profile iteratively—every interaction makes recommendations smarter.",
      },
      {
        type: "list",
        items: [
          "Style quiz identifies aesthetic preferences (60 seconds)",
          "Basic measurements for fit recommendations (60 seconds)",
          "First outfit generated immediately (30 seconds)",
          "Profile refines with every interaction",
        ],
      },
      { type: "heading", level: 2, content: "Results" },
      {
        type: "callout",
        variant: "success",
        content:
          "Achieved $0.002/call average cost—10x cheaper than competitors using direct GPT-4 calls for everything.",
      },
      { type: "heading", level: 2, content: "Reflections" },
      {
        type: "text",
        content:
          "The hardest part isn't the AI—it's the product decisions. Which features actually matter to users? What's the right balance between personalization and simplicity? I'm learning that shipping fast and talking to users beats theorizing in isolation.",
      },
    ],
  },
  "ai-answer-engine": {
    title: "AI Answer Engine",
    subtitle: "Production AI-powered search processing 100+ URLs/hour",
    timeline: "Sep 2024 – Oct 2024",
    role: "Solo Developer",
    stack: ["Next.js", "Groq SDK", "Cheerio", "Puppeteer", "Vercel"],
    github: "https://github.com/Smear6uard/AI-Answer-Engine",
    live: "https://ai-answer-engine-addv.vercel.app",
    heroImage: "/projects/ai-engine-screenshot.png",
    metrics: [
      { label: "Accuracy", value: "98%" },
      { label: "Response Time", value: "<2s" },
      { label: "URLs/Hour", value: "100+" },
      { label: "Queries Handled", value: "1,000+" },
    ],
    content: [
      { type: "heading", level: 2, content: "The Problem" },
      {
        type: "text",
        content:
          "Research is slow. Finding accurate answers across multiple sources requires opening dozens of tabs, reading through irrelevant content, and manually synthesizing information. I wanted to build a tool that could do this automatically with high accuracy.",
      },
      { type: "heading", level: 2, content: "The Insight" },
      {
        type: "text",
        content:
          "Most AI search tools fail because they either scrape poorly or synthesize poorly. The key is doing both well: aggressive content extraction with smart fallbacks, combined with AI that actually cites its sources.",
      },
      { type: "heading", level: 2, content: "The Solution" },
      { type: "heading", level: 3, content: "Architecture" },
      {
        type: "text",
        content: "The system works in three stages:",
      },
      {
        type: "list",
        items: [
          "Query Analysis: Parse user's question to identify key entities and intent",
          "Content Extraction: Scrape relevant URLs using Cheerio for static content, Puppeteer for JS-rendered pages",
          "AI Synthesis: Generate accurate answers with source citations using Groq SDK",
        ],
      },
      { type: "heading", level: 3, content: "Key Technical Decisions" },
      {
        type: "code",
        language: "typescript",
        filename: "scraper.ts",
        content: `async function scrapeWithFallback(url: string) {
  try {
    // Try fast path first (Cheerio)
    const response = await fetch(url);
    const html = await response.text();

    // Check if content is JavaScript-rendered
    if (isJSRendered(html)) {
      return await scrapeWithPuppeteer(url);
    }

    return parseWithCheerio(html);
  } catch (error) {
    // Graceful degradation
    console.log(\`Fallback for \${url}\`);
    return { success: false, error };
  }
}`,
      },
      {
        type: "callout",
        variant: "info",
        content:
          "Groq over OpenAI: Groq's inference speed (40% faster) was critical for keeping response times under 2 seconds. The accuracy tradeoff was minimal.",
      },
      { type: "heading", level: 2, content: "Results" },
      {
        type: "text",
        content:
          "The system processes 100+ URLs per hour with 98% accuracy on factual queries. Deployed on Vercel, it handles 1,000+ queries with consistent sub-2-second response times.",
      },
      { type: "heading", level: 2, content: "Reflections" },
      {
        type: "text",
        content:
          "The biggest challenge was handling unreliable external URLs—timeouts, rate limits, malformed HTML. Building robust error handling and fallback strategies was more complex than the core AI integration. In production, the edge cases are always harder than the happy path.",
      },
    ],
  },
  "stock-exchange": {
    title: "Mock Stock Exchange Platform",
    subtitle: "Real-time matching engine handling 500+ trades per session",
    timeline: "Sep 2024 – Oct 2024",
    role: "Solo Developer",
    stack: ["Java", "JUnit", "Data Structures"],
    heroImage: "/projects/stock-exchange.png",
    metrics: [
      { label: "Trades/Session", value: "500+" },
      { label: "Users Simulated", value: "100+" },
      { label: "Test Coverage", value: "100%" },
      { label: "Order Updates", value: "ms-level" },
    ],
    content: [
      { type: "heading", level: 2, content: "The Problem" },
      {
        type: "text",
        content:
          "Understanding how real exchanges work requires hands-on implementation. Reading about price-time priority is one thing; handling partial fills and maintaining order book integrity is another. I built this to deeply understand exchange mechanics.",
      },
      { type: "heading", level: 2, content: "The Insight" },
      {
        type: "text",
        content:
          "Financial systems demand precision. A single edge case in the matching engine—say, a partial fill that doesn't update remaining quantity correctly—can cascade into incorrect portfolio states and audit trail gaps. The devil is in the details.",
      },
      { type: "heading", level: 2, content: "The Solution" },
      { type: "heading", level: 3, content: "Core Architecture" },
      {
        type: "text",
        content: "Modular class design with clear separation of concerns:",
      },
      {
        type: "list",
        items: [
          "Price: Immutable value object for currency handling",
          "Order: Buy/sell orders with quantity, price, and timestamp",
          "Quote: Real-time bid/ask spread tracking",
          "OrderBook: Price-time priority matching engine",
          "Portfolio: User holdings and balance validation",
        ],
      },
      { type: "heading", level: 3, content: "Matching Engine" },
      {
        type: "code",
        language: "java",
        filename: "OrderBook.java",
        content: `public List<Trade> match(Order incomingOrder) {
    List<Trade> trades = new ArrayList<>();

    PriorityQueue<Order> oppositeBook = incomingOrder.isBuy()
        ? sellOrders : buyOrders;

    while (!oppositeBook.isEmpty() && canMatch(incomingOrder, oppositeBook.peek())) {
        Order matchedOrder = oppositeBook.peek();
        int fillQty = Math.min(
            incomingOrder.getRemainingQty(),
            matchedOrder.getRemainingQty()
        );

        // Execute trade
        trades.add(new Trade(incomingOrder, matchedOrder, fillQty));

        // Handle partial fills
        incomingOrder.fill(fillQty);
        matchedOrder.fill(fillQty);

        if (matchedOrder.isFilled()) {
            oppositeBook.poll();
        }
        if (incomingOrder.isFilled()) break;
    }

    return trades;
}`,
      },
      { type: "heading", level: 2, content: "Results" },
      {
        type: "text",
        content:
          "The system handles 100+ concurrent users and 1,000+ trade events per session. The matching engine executes 500+ trades with millisecond-level order book updates. 50+ unit and integration tests provide 100% coverage.",
      },
      { type: "heading", level: 2, content: "Reflections" },
      {
        type: "text",
        content:
          "The hardest part was handling partial fills correctly—when a large order matches against multiple smaller orders at different prices. Edge cases in financial systems compound quickly. This project taught me why exchanges invest so heavily in testing infrastructure.",
      },
    ],
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
    title: project.title,
    description: project.subtitle,
    alternates: {
      canonical: `https://sameerakhtar.dev/work/${slug}`,
    },
    openGraph: {
      title: `${project.title} | Sameer Akhtar`,
      description: project.subtitle,
      url: `https://sameerakhtar.dev/work/${slug}`,
      type: "article",
      authors: ["Sameer Akhtar"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Sameer Akhtar`,
      description: project.subtitle,
    },
  };
}

/**
 * Syntax highlighting for code blocks.
 * Note: This is safe because it only processes static, developer-controlled content
 * from the projects object above. All HTML entities are escaped before highlighting.
 */
function highlightCode(code: string, language: string): string {
  const keywords: Record<string, string[]> = {
    typescript: ["async", "await", "const", "let", "function", "return", "if", "else", "try", "catch", "import", "export", "type", "interface"],
    java: ["public", "private", "class", "void", "int", "boolean", "return", "if", "else", "while", "new", "List"],
  };

  // Escape HTML entities first for safety
  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Highlight strings
  highlighted = highlighted.replace(
    /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
    '<span class="text-green-400">$&</span>'
  );

  // Highlight comments
  highlighted = highlighted.replace(
    /(\/\/.*$)/gm,
    '<span class="text-text-muted">$1</span>'
  );

  // Highlight keywords
  const langKeywords = keywords[language] || keywords.typescript;
  langKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, "g");
    highlighted = highlighted.replace(
      regex,
      '<span class="text-purple-400">$1</span>'
    );
  });

  return highlighted;
}

function renderContentBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "heading":
      if (block.level === 2) {
        return (
          <h2
            key={index}
            className="text-xl font-semibold text-text-primary mt-12 mb-4"
          >
            {block.content}
          </h2>
        );
      }
      return (
        <h3
          key={index}
          className="text-lg font-medium text-text-primary mt-8 mb-3"
        >
          {block.content}
        </h3>
      );

    case "text":
      return (
        <p key={index} className="text-text-secondary leading-relaxed mb-4">
          {block.content}
        </p>
      );

    case "code":
      return (
        <div key={index} className="my-6 rounded-lg overflow-hidden border border-white/10">
          {block.filename && (
            <div className="px-4 py-2 bg-white/5 border-b border-white/10 font-mono text-xs text-text-muted">
              {block.filename}
            </div>
          )}
          <pre className="p-4 bg-[#0d1117] overflow-x-auto">
            <code
              className="text-sm font-mono leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightCode(block.content, block.language),
              }}
            />
          </pre>
        </div>
      );

    case "image":
      return (
        <figure key={index} className="my-8">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-text-muted">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "list":
      return (
        <ul key={index} className="list-disc list-inside mb-4 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="text-text-secondary">
              {item}
            </li>
          ))}
        </ul>
      );

    case "callout":
      const variants = {
        info: "border-blue-500/50 bg-blue-500/10",
        warning: "border-yellow-500/50 bg-yellow-500/10",
        success: "border-green-500/50 bg-green-500/10",
      };
      return (
        <div
          key={index}
          className={`my-6 p-4 rounded-lg border-l-4 ${variants[block.variant || "info"]}`}
        >
          <p className="text-text-secondary">{block.content}</p>
        </div>
      );

    default:
      return null;
  }
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
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://sameerakhtar.dev" },
          { name: "Projects", url: "https://sameerakhtar.dev/#work" },
          { name: project.title, url: `https://sameerakhtar.dev/work/${slug}` },
        ]}
      />
      <ProjectJsonLd
        title={project.title}
        description={project.subtitle}
        url={`https://sameerakhtar.dev/work/${slug}`}
        datePublished={
          project.timeline.split(" – ")[0].includes("Dec 2024")
            ? "2024-12-01"
            : "2024-09-01"
        }
        author="Sameer Akhtar"
      />
      <article className="pt-32 pb-20">
        {/* Back link */}
        <div className="max-w-3xl mx-auto px-6 mb-8">
          <Link
            href="/#work"
            className="text-sm text-text-muted hover:text-accent transition-colors inline-flex items-center gap-1"
          >
            <span>←</span> back to projects
          </Link>
        </div>

        {/* Hero image */}
        {project.heroImage && (
          <HeroImage src={project.heroImage} alt={project.title} />
        )}

        <div className="max-w-3xl mx-auto px-6">
          <header className="mb-12">
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
                    className="text-accent link-underline inline-flex items-center gap-1"
                  >
                    View on GitHub <span>→</span>
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent link-underline inline-flex items-center gap-1"
                  >
                    Live Demo <span>↗</span>
                  </a>
                )}
              </div>
            )}
          </header>

          {/* Content blocks */}
          <div className="prose-custom">
            {project.content.map((block, index) =>
              renderContentBlock(block, index)
            )}
          </div>
        </div>
      </article>
    </>
  );
}

