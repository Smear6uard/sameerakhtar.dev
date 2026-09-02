// Case-study data. Static and developer-controlled; the code highlighter
// below escapes HTML before wrapping tokens, so its output is safe to render.

import { links } from "./site";

export type ContentBlock =
  | { type: "text"; content: string }
  | { type: "heading"; level: 2 | 3; content: string }
  | { type: "code"; language: string; content: string; filename?: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; content: string };

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Highlight {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  /** One line for lists and meta descriptions. */
  subtitle: string;
  /** Two or three sentences for the home-page row. */
  summary: string;
  timeline: string;
  year: string;
  role: string;
  stack: string[];
  links: ProjectLink[];
  highlights: Highlight[];
  featured: boolean;
  /** ISO date used for structured data. */
  datePublished: string;
  content: ContentBlock[];
}

export const projects: Record<string, Project> = {
  renaro: {
    slug: "renaro",
    title: "Renaro",
    subtitle: "Multi-tenant dispatch software for taxi and limo fleets that shows its work",
    summary:
      "Dispatch, payments, driver operations, messaging, and analytics for fleet operators, built and shipped solo. Every dispatch decision exposes its factors, every state change leaves an audit record, and the money paths are idempotent by construction.",
    timeline: "Mar 2026 – Present",
    year: "2026",
    role: "Founder & sole engineer",
    stack: [
      "TypeScript",
      "Fastify",
      "PostgreSQL",
      "Drizzle",
      "pg-boss",
      "Redis",
      "WebSockets",
      "Stripe Connect",
      "WorkOS",
    ],
    links: [{ label: "renaroapp.com", href: links.renaro }],
    highlights: [
      { value: "4,543", label: "connections held under a 10K reconnect storm, up from 124" },
      { value: "97%", label: "event delivery at simulated 3K-tenant load" },
      { value: "$3K+", label: "pre-launch revenue, operator pilot prepared" },
    ],
    featured: true,
    datePublished: "2026-03-01",
    content: [
      { type: "heading", level: 2, content: "The problem" },
      {
        type: "text",
        content:
          "Taxi, limo, and chauffeur operators run on dispatch systems that make decisions nobody can explain. A driver gets assigned, a price gets quoted, a payout gets held, and the operator has no record of why. I spent two years integrating one of those systems at a limo company, which is where the idea for Renaro came from.",
      },
      { type: "heading", level: 2, content: "What I built" },
      {
        type: "text",
        content:
          "Renaro is a multi-tenant platform covering the whole operation: a live dispatch console with driver scoring, bookings from phone, web, app, and corporate portals, driver and passenger mobile apps, GPS telemetry, a double-entry ledger for payments and settlements, reporting, and an audit trail on every state change. The positioning is auditable automation: dispatch decisions expose their factors and weights, and pricing changes can be simulated against history before they go live.",
      },
      { type: "heading", level: 2, content: "The reconnect storm" },
      {
        type: "text",
        content:
          "Real-time dispatch lives or dies on WebSockets, so I load-tested the worst case: 10,000 clients reconnecting at once, the way they would after a deploy or a network blip. The first run held 124 authenticated connections. Hardening the handshake and the connection lifecycle brought that to 4,543.",
      },
      {
        type: "text",
        content:
          "The second bottleneck was event fan-out. Polling the outbox per tenant collapsed as tenant count grew. Replacing it with a single SKIP LOCKED batch claim let a pool of workers drain the outbox without contending on rows, and restored 97% event delivery at a simulated 3,000-tenant load.",
      },
      {
        type: "code",
        language: "sql",
        filename: "claim_batch.sql",
        content: `-- Workers claim a batch without blocking each other.
-- Rows locked by another worker are skipped, not waited on.
UPDATE outbox_events
SET    claimed_by = $1, claimed_at = now()
WHERE  id IN (
  SELECT id
  FROM   outbox_events
  WHERE  claimed_at IS NULL
  ORDER  BY created_at
  FOR UPDATE SKIP LOCKED
  LIMIT  $2
)
RETURNING id, tenant_id, payload;`,
      },
      { type: "heading", level: 2, content: "Money paths" },
      {
        type: "text",
        content:
          "Payments run on Stripe Connect: ACH, disputes, refunds, payout holds, and metered billing. Every path is idempotent, webhooks are deduplicated before they touch state, and balance updates use compare-and-swap so a retried webhook or a double-click can never move money twice.",
      },
      { type: "heading", level: 2, content: "Tenant isolation" },
      {
        type: "list",
        items: [
          "Forced PostgreSQL row-level security on every tenant table, so isolation does not depend on remembering a WHERE clause.",
          "CI schema gates that fail the build if a tenant table ships without a policy.",
          "An adversarial test suite that attempts cross-tenant reads, writes, and payment IDOR against the live API.",
        ],
      },
      { type: "heading", level: 2, content: "Where it stands" },
      {
        type: "callout",
        content:
          "$3K+ in pre-launch revenue and an operator pilot prepared, with import pipelines from FastTrak and Limo Anywhere so a fleet can run both systems in parallel for a week or two before switching.",
      },
      { type: "heading", level: 2, content: "What I learned" },
      {
        type: "text",
        content:
          "The features that sold were not the clever ones. Operators wanted to see why a driver was chosen and to trust that a payout would not be lost. Most of the engineering effort went into retries, deduplication, locks, and policies that hold without anyone having to remember them.",
      },
    ],
  },

  "brand-discovery": {
    slug: "brand-discovery",
    title: "AI Brand Discovery",
    subtitle:
      "A GenAI feature at Quantum Metric that derives survey branding from PDFs and websites",
    summary:
      "Owned end to end as an intern: a React/TypeScript frontend, a Go backend, and a new browser-rendering service that turns a customer's website or PDF into an on-brand survey theme. Taken from pre-GA design to production launch.",
    timeline: "Jun 2026 – Present",
    year: "2026",
    role: "Software engineering intern, feature owner · Quantum Metric",
    stack: [
      "Go",
      "Gemini 2.5 Flash",
      "Vertex AI",
      "Cloud Run",
      "Playwright",
      "Terraform",
      "Redis",
      "React",
      "TypeScript",
    ],
    links: [],
    highlights: [
      { value: "Pre-GA → GA", label: "designed and launched to production" },
      { value: "~2–3 s", label: "warm end-to-end renders" },
      { value: "SSRF-hardened", label: "rendering service for untrusted URLs" },
    ],
    featured: true,
    datePublished: "2026-06-01",
    content: [
      {
        type: "callout",
        content:
          "This is internal product work. The details here are limited to what appears on my public résumé.",
      },
      { type: "heading", level: 2, content: "What it does" },
      {
        type: "text",
        content:
          "Customers building surveys want them to look like their brand without hand-picking colors and fonts. AI Brand Discovery takes a website URL or a PDF, renders it, measures what is actually on the page, and proposes a survey theme grounded in those measurements.",
      },
      { type: "heading", level: 2, content: "Ownership" },
      {
        type: "text",
        content:
          "I owned the feature from pre-GA design through production launch across three surfaces: the React/TypeScript frontend, the Go backend, and a new browser-rendering service that did not exist before.",
      },
      { type: "heading", level: 2, content: "Grounding the model" },
      {
        type: "text",
        content:
          "The pipeline runs on Go with Gemini 2.5 Flash through Vertex AI. Output is schema-constrained so the frontend never parses free text, and the prompts carry injection defenses because the input is whatever a customer's website says. Colors are not taken from the model at all: they are grounded in palettes measured from the render and checked for WCAG contrast, which removed the model's habit of inventing brand colors.",
      },
      { type: "heading", level: 2, content: "Rendering untrusted URLs" },
      {
        type: "list",
        items: [
          "Cloud Run + Playwright service that renders arbitrary customer URLs.",
          "Terraform for Direct VPC egress, Cloud NAT, OIDC auth between services, and a deny-private-range firewall.",
          "SSRF hardening through DNS pinning and redirect revalidation, so a redirect cannot reach internal ranges after the initial check.",
        ],
      },
      { type: "heading", level: 2, content: "Async workers" },
      {
        type: "text",
        content:
          "Go workers with Redis-backed async orchestration handle the long-running renders: rate limiting, stale-job recovery, failure-aware retries, graceful shutdown draining, and cold-start egress validation so a fresh instance proves it can reach the internet before it accepts work. Warm end-to-end renders complete in about two to three seconds.",
      },
      { type: "heading", level: 2, content: "What I learned" },
      {
        type: "text",
        content:
          "Most of the engineering was around the model, not inside it. Grounding, output constraints, and a rendering service that cannot be turned against the network mattered more to shipping than any prompt.",
      },
    ],
  },

  styleum: {
    slug: "styleum",
    title: "Styleum",
    subtitle: "An iOS wardrobe app that builds four outfits from your closet every morning",
    summary:
      "Photograph your clothes once and wake up to four weather-aware outfits on your lock screen at 9 AM. A five-stage vision and LLM pipeline runs each outfit for about $0.002. Built solo and shipped to the App Store in eight weeks; now past 100 users.",
    timeline: "Dec 2025 – Present",
    year: "2025",
    role: "Founder & sole engineer",
    stack: [
      "Swift",
      "SwiftUI",
      "TypeScript",
      "Hono",
      "BiRefNet",
      "Florence-2",
      "FashionSigLIP",
      "Gemini",
    ],
    links: [
      { label: "styleum.xyz", href: links.styleum },
      { label: "App Store", href: links.styleumAppStore },
    ],
    highlights: [
      { value: "100+", label: "users on the App Store" },
      { value: "$0.002", label: "per generated outfit" },
      { value: "8 weeks", label: "from first commit to launch" },
    ],
    featured: true,
    datePublished: "2025-12-01",
    content: [
      { type: "heading", level: 2, content: "The problem" },
      {
        type: "text",
        content:
          "Wardrobe apps ask for twenty minutes of setup before they show anything useful, and the AI behind them is either too expensive to run per user or too generic to be worth opening. People churn before they ever see an outfit.",
      },
      { type: "heading", level: 2, content: "The product" },
      {
        type: "text",
        content:
          "Styleum digitises a wardrobe from one photo per garment, removes the background, identifies colour, fabric, and cut, then delivers four outfit combinations to the lock screen each morning. Selections are weather-aware, and the ranking learns from what you wear and what you skip. A Style Me mode handles occasions. Photos stay private and are never used to train models.",
      },
      { type: "heading", level: 2, content: "Five stages instead of one model" },
      {
        type: "text",
        content:
          "Fashion-specific models beat general-purpose vision by a wide margin: FashionSigLIP retrieves fashion items far more accurately than CLIP. Chaining narrow models, each responsible for one job, made the pipeline both better and cheaper than a single large multimodal call.",
      },
      {
        type: "list",
        items: [
          "BiRefNet for background removal and garment segmentation",
          "Florence-2 for garment attributes: category, colour, pattern",
          "FashionSigLIP for 768-dimensional fashion embeddings used in retrieval",
          "Body and proportion analysis when a user chooses to provide a photo",
          "Gemini for final outfit composition and the styling rationale",
        ],
      },
      {
        type: "code",
        language: "typescript",
        filename: "pipeline.ts",
        content: `async function generateOutfit(wardrobe: GarmentImage[]) {
  const segments = await birefnet.segment(wardrobe);        // ~$0.0003
  const attributes = await florence2.analyze(segments);      // ~$0.001
  const embeddings = await fashionSigLIP.encode(attributes); // ~$0.00002
  const candidates = retrieveCompatible(embeddings, history);

  return gemini.compose({ candidates, attributes, weather, occasion });
  // total: ~$0.002 per outfit
}`,
      },
      { type: "heading", level: 2, content: "Shipping it" },
      {
        type: "text",
        content:
          "The client is SwiftUI with a Hono and TypeScript backend coordinating the stages. Every pipeline boundary is a recoverable state: a scan can retry without duplicating a garment, a partial wardrobe stays usable, and slow stages report progress instead of freezing the interface. Notifications, streaks, and outfit history shipped after the core loop worked.",
      },
      {
        type: "callout",
        content:
          "Live on the App Store with a free tier and a Pro subscription. Past 100 users, at about $0.002 per generated outfit.",
      },
      { type: "heading", level: 2, content: "What I learned" },
      {
        type: "text",
        content:
          "Good AI products hide model complexity without hiding system state. Users never need to know which vision model ran, but they do need to know a scan is progressing, a retry is safe, and why an outfit was suggested.",
      },
    ],
  },

  hazardlens: {
    slug: "hazardlens",
    title: "HazardLens",
    subtitle: "Real-time construction-site safety monitoring with YOLO26 at 15+ FPS",
    summary:
      "A video pipeline that detects missing PPE, hazard-zone violations, worker-vehicle proximity, and near-miss incidents, tracks workers across frames, and streams severity-scored alerts to a live dashboard.",
    timeline: "Feb 2026",
    year: "2026",
    role: "Solo build",
    stack: ["Python", "YOLO26", "OpenCV", "FastAPI", "Shapely", "React", "Docker Compose"],
    links: [
      { label: "GitHub", href: links.hazardlens },
      { label: "Video demo", href: links.hazardlensDemo },
    ],
    highlights: [
      { value: "15+ FPS", label: "on CPU, 25–30 with a GPU" },
      { value: "<2 ms", label: "per frame for tracking and zone checks" },
      { value: "4 event types", label: "PPE, zones, proximity, falls" },
    ],
    featured: true,
    datePublished: "2026-02-01",
    content: [
      { type: "heading", level: 2, content: "The problem" },
      {
        type: "text",
        content:
          "PPE compliance on construction sites is checked by people, occasionally, and after the fact. Violations get noticed when something has already gone wrong.",
      },
      { type: "heading", level: 2, content: "The pipeline" },
      {
        type: "text",
        content:
          "Frames are decoded with OpenCV and run through YOLO26, whose NMS-free architecture removes the post-processing step that usually caps real-time throughput. Detections then pass through PPE classification, polygon zone checks, centroid tracking, and temporal event detection before annotated frames stream to the dashboard.",
      },
      {
        type: "list",
        items: [
          "Hard-hat and vest classification from detections, with HSV colour analysis for PPE state",
          "Customisable hazard zones as polygons, checked with Shapely",
          "Centroid tracking that keeps worker identity across frames without re-identification overhead",
          "Temporal rules for PPE removed mid-shift, zone entry, worker-vehicle proximity, and fallen-worker detection",
          "Composite risk scoring that routes events to the right alert level",
        ],
      },
      {
        type: "code",
        language: "python",
        filename: "detector.py",
        content: `class SafetyDetector:
    def process_frame(self, frame: np.ndarray) -> DetectionResult:
        detections = self.model.predict(frame, conf=0.5)   # YOLO26, NMS-free
        tracked = self.tracker.update(detections)           # centroid tracking

        events = self.event_detector.analyze(
            tracked,
            zones=self.zones,
            ppe_history=self.compliance_log,
        )
        for event in events:
            severity = self.risk_scorer.evaluate(event)
            if severity >= AlertLevel.WARNING:
                self.alerts.trigger(event, severity)

        return DetectionResult(tracked, events)`,
      },
      { type: "heading", level: 2, content: "Dashboard" },
      {
        type: "text",
        content:
          "A React dashboard shows the annotated feed, live metrics, and a violation log. The FastAPI backend streams events over server-sent events and WebSockets. A demo mode runs without a GPU, and the whole stack starts with one docker compose command.",
      },
      {
        type: "callout",
        content:
          "10–15 FPS on CPU and 25–30 FPS with a GPU, with tracking and zone checks under 2 ms per frame.",
      },
      { type: "heading", level: 2, content: "What I learned" },
      {
        type: "text",
        content:
          "The hard part was temporal: telling a worker adjusting a hard hat apart from a worker removing it. Sliding-window analysis over tracked state solved most false positives; occlusion needed careful tuning of confidence decay in the tracker.",
      },
    ],
  },

  windwalk: {
    slug: "windwalk",
    title: "WindWalk",
    subtitle: "Weather-aware walking routes through Chicago's Pedway, 1st place at DemonHacks 2026",
    summary:
      "Chicago's Loop has a five-mile underground Pedway that nobody can navigate. WindWalk models it as a graph, pulls live wind from OpenWeatherMap, and routes pedestrians through a mix of tunnels and streets that minimises wind exposure.",
    timeline: "Mar 2026",
    year: "2026",
    role: "Six-person team, 36 hours",
    stack: ["Python", "FastAPI", "React Native", "Expo", "Mapbox", "OpenWeatherMap"],
    links: [{ label: "Devpost", href: links.windwalk }],
    highlights: [
      { value: "1st place", label: "DemonHacks 2026" },
      { value: "40+ nodes", label: "Pedway graph reverse-engineered from static maps" },
      { value: "Live wind", label: "weighted into Dijkstra edge costs" },
    ],
    featured: true,
    datePublished: "2026-03-01",
    content: [
      { type: "heading", level: 2, content: "The idea" },
      {
        type: "text",
        content:
          "Chicago winters are brutal at street level, and the Loop has five miles of heated underground walkways that most people never use because there is no good map. We built the map and the router in one weekend.",
      },
      { type: "heading", level: 2, content: "How it works" },
      {
        type: "list",
        items: [
          "The Pedway is modelled as a graph of 40+ nodes and 50+ edges, reverse-engineered from static maps because no public dataset exists.",
          "Street-level edges are weighted by live wind speed and direction from OpenWeatherMap; underground edges carry no wind penalty.",
          "Dijkstra runs over the merged graph, so a route can dip underground for a block and resurface where the wind is calmer.",
          "Python and FastAPI serve routes to a React Native and Expo client rendering on Mapbox.",
        ],
      },
      {
        type: "callout",
        content:
          "First hackathon for all six of us. We pivoted mid-event, refocused, and took first place.",
      },
    ],
  },

  "llm-router": {
    slug: "llm-router",
    title: "Intelligent LLM Router",
    subtitle: "A routing layer that cuts LLM API costs by up to 40% with under 50 ms overhead",
    summary:
      "Classifies prompt complexity across seven task types from six weighted signals and routes each request to the cheapest capable model.",
    timeline: "Feb 2026",
    year: "2026",
    role: "Solo build",
    stack: ["Python", "FastAPI", "React", "OpenRouter"],
    links: [{ label: "GitHub", href: links.llmRouter }],
    highlights: [
      { value: "40%", label: "cost reduction on typical traffic" },
      { value: "<50 ms", label: "routing overhead" },
      { value: "7", label: "task types" },
    ],
    featured: false,
    datePublished: "2026-02-01",
    content: [
      { type: "heading", level: 2, content: "The problem" },
      {
        type: "text",
        content:
          "Most applications send every prompt to the same expensive model. A greeting costs as much as a multi-step reasoning task.",
      },
      { type: "heading", level: 2, content: "The approach" },
      {
        type: "text",
        content:
          "Prompt complexity is predictable. Six signals — token count, vocabulary diversity, question depth, domain specificity, reasoning requirements, and output format — classify each prompt into one of seven task types, and each type maps to the cheapest model that handles it well. An A/B arena compares latency, accuracy, and cost across models to keep the routing table honest.",
      },
      {
        type: "code",
        language: "python",
        filename: "router.py",
        content: `class LLMRouter:
    def route(self, prompt: str) -> ModelSelection:
        signals = self.analyzer.extract_signals(prompt)
        task_type = self.classifier.predict(signals)
        model = self.selector.select(task_type, budget=self.budget)
        return ModelSelection(model, confidence=signals.confidence)`,
      },
      { type: "heading", level: 2, content: "What I learned" },
      {
        type: "text",
        content:
          "Early versions over-routed to expensive models because token count was weighted too heavily. Vocabulary diversity and reasoning depth turned out to be much better predictors of difficulty.",
      },
    ],
  },

  deepcite: {
    slug: "deepcite",
    title: "DeepCite",
    subtitle: "An AI research engine with dual-mode retrieval and inline citations",
    summary:
      "Fast static scraping that falls back to headless rendering only when needed, Redis caching across queries, and streamed answers with inline source citations.",
    timeline: "Oct 2025 – Jan 2026",
    year: "2025",
    role: "Solo build",
    stack: ["Next.js", "TypeScript", "Groq", "Redis", "Puppeteer"],
    links: [
      { label: "GitHub", href: links.deepcite },
      { label: "Live", href: links.deepciteLive },
    ],
    highlights: [
      { value: "100+", label: "URLs per hour" },
      { value: "<100 ms", label: "perceived latency via streaming" },
      { value: "2 modes", label: "static parse with headless fallback" },
    ],
    featured: false,
    datePublished: "2025-10-01",
    content: [
      { type: "heading", level: 2, content: "The problem" },
      {
        type: "text",
        content:
          "AI search tools either scrape poorly or synthesise poorly: they miss JavaScript-rendered pages, rate-limit themselves on parallel requests, or answer without verifiable sources.",
      },
      { type: "heading", level: 2, content: "The approach" },
      {
        type: "list",
        items: [
          "Cheerio for fast static parsing on the primary path",
          "Puppeteer fallback triggered only when static extraction returns too little content",
          "Serper for source discovery and Redis for deduplication across queries",
          "Promise.allSettled for parallel scraping with graceful failure",
          "Server-sent events streaming the answer with inline citations as it is written",
        ],
      },
      { type: "heading", level: 2, content: "What I learned" },
      {
        type: "text",
        content:
          "Unreliable external URLs were the real work: timeouts, malformed HTML, and anti-bot detection. Tuning the fallback thresholds took more real-world testing than anything in the model layer.",
      },
    ],
  },
};

export const FEATURED_ORDER = ["renaro", "brand-discovery", "styleum", "hazardlens", "windwalk"];
export const ARCHIVE_ORDER = ["llm-router", "deepcite"];

export function getProject(slug: string): Project | undefined {
  return projects[slug];
}

export function getFeaturedProjects(): Project[] {
  return FEATURED_ORDER.map((slug) => projects[slug]);
}

export function getArchivedProjects(): Project[] {
  return ARCHIVE_ORDER.map((slug) => projects[slug]);
}

export function getAllProjectSlugs(): string[] {
  return Object.keys(projects);
}

const KEYWORDS: Record<string, string[]> = {
  typescript: [
    "async",
    "await",
    "const",
    "let",
    "function",
    "return",
    "if",
    "else",
    "try",
    "catch",
    "import",
    "export",
    "type",
    "interface",
  ],
  python: [
    "class",
    "def",
    "return",
    "if",
    "for",
    "in",
    "self",
    "import",
    "from",
    "not",
    "and",
    "or",
  ],
  sql: [
    "UPDATE",
    "SET",
    "WHERE",
    "IN",
    "SELECT",
    "FROM",
    "IS",
    "NULL",
    "ORDER",
    "BY",
    "FOR",
    "SKIP",
    "LOCKED",
    "LIMIT",
    "RETURNING",
    "now",
  ],
};

/** Escapes HTML, then wraps strings, comments, and keywords in token spans. */
export function highlightCode(code: string, language: string): string {
  let out = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  out = out.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="tok-str">$&</span>');

  const commentPattern =
    language === "python" || language === "sql" ? /(#.*$|--.*$)/gm : /(\/\/.*$)/gm;
  out = out.replace(commentPattern, '<span class="tok-cm">$1</span>');

  const keywords = KEYWORDS[language] ?? KEYWORDS.typescript;
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, "g");
    out = out.replace(regex, '<span class="tok-kw">$1</span>');
  });

  return out;
}

export type ProcessedContentBlock =
  | Exclude<ContentBlock, { type: "code" }>
  | (Extract<ContentBlock, { type: "code" }> & { highlightedCode: string });

export function processContentBlocks(content: ContentBlock[]): ProcessedContentBlock[] {
  return content.map((block) =>
    block.type === "code"
      ? { ...block, highlightedCode: highlightCode(block.content, block.language) }
      : block,
  );
}
