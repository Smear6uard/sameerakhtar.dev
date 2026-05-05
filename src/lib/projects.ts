// Project case study data + syntax highlighting.
// Extracted from src/app/work/[slug]/page.tsx so the route file can stay
// lean and the data is reusable from sitemap generation.

export type ContentBlock =
  | { type: "text"; content: string }
  | { type: "heading"; level: 2 | 3; content: string }
  | { type: "code"; language: string; content: string; filename?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; content: string; variant?: "info" | "warning" | "success" };

export interface Project {
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

export const projects: Record<string, Project> = {
  styleum: {
    title: "Styleum",
    subtitle:
      "AI-powered iOS styling app generating outfits at $0.002 each — shipped to the App Store in 8 weeks",
    timeline: "Dec 2025 – Present",
    role: "Founder & Engineer",
    stack: [
      "Swift",
      "SwiftUI",
      "Hono",
      "TypeScript",
      "AWS Rekognition",
      "BiRefNet",
      "Florence-2",
      "FashionSigLIP",
      "Gemini",
    ],
    live: "https://apps.apple.com/us/app/styleum-daily-fits/id6757777880",
    metrics: [
      { label: "Cost per Outfit", value: "$0.002" },
      { label: "vs. Competitors", value: "40% cheaper" },
      { label: "Time to App Store", value: "8 weeks" },
      { label: "Status", value: "Live" },
    ],
    content: [
      { type: "heading", level: 2, content: "The Problem" },
      {
        type: "text",
        content:
          "Existing wardrobe apps demand 20+ minutes of setup before delivering any value. The AI recommendations are either too expensive to scale ($0.02+ per call) or too generic to be useful. Users churn before they ever see a styled outfit.",
      },
      { type: "heading", level: 2, content: "The Insight" },
      {
        type: "text",
        content:
          "Fashion-specific vision models outperform general-purpose ones by a wide margin. FashionSigLIP achieves 74% fashion retrieval accuracy vs. CLIP's 47%. By chaining specialized models instead of throwing everything at one expensive API, the pipeline costs drop dramatically.",
      },
      { type: "heading", level: 2, content: "The Solution" },
      { type: "heading", level: 3, content: "5-Stage ML Pipeline" },
      {
        type: "text",
        content: "Each stage handles one responsibility, optimized for cost and accuracy:",
      },
      {
        type: "list",
        items: [
          "BiRefNet: Background removal and garment segmentation",
          "Florence-2: Fine-grained garment attribute extraction (color, pattern, category)",
          "FashionSigLIP: 768-dim fashion-specific embeddings for style matching",
          "AWS Rekognition: Body type and proportion analysis",
          "Gemini: Final outfit composition and natural language styling rationale",
        ],
      },
      {
        type: "code",
        language: "typescript",
        filename: "pipeline.ts",
        content: `async function generateOutfit(wardrobe: GarmentImage[]) {
  // Stage 1: Segment garments ($0.0003)
  const segments = await birefnet.segment(wardrobe);

  // Stage 2: Extract attributes ($0.001)
  const attributes = await florence2.analyze(segments);

  // Stage 3: Style embeddings ($0.00002)
  const embeddings = await fashionSigLIP.encode(attributes);

  // Stage 4: Body analysis ($0.001)
  const bodyProfile = await rekognition.analyze(userPhoto);

  // Stage 5: Compose outfit ($0.002)
  return gemini.compose({ embeddings, bodyProfile, attributes });
  // Total: ~$0.002/outfit
}`,
      },
      { type: "heading", level: 3, content: "Native iOS App" },
      {
        type: "text",
        content:
          "Built the full-stack iOS app in Swift/SwiftUI with a Hono/TypeScript backend. Engineered push notification scheduling with streak tracking and XP rewards using APNs and local persistence, supporting daily delivery to all users. Shipped from first commit to App Store in 8 weeks as sole engineer.",
      },
      { type: "heading", level: 2, content: "Results" },
      {
        type: "callout",
        variant: "success",
        content:
          "Achieved $0.002/outfit — 40% below competitor costs. Full pipeline processes wardrobe scans to styled outfits end-to-end.",
      },
      { type: "heading", level: 2, content: "Reflections" },
      {
        type: "text",
        content:
          "The hardest part was finding the right model for each stage. General-purpose vision APIs are easy to integrate but expensive and inaccurate for fashion. Specialized models like FashionSigLIP require more pipeline engineering but deliver dramatically better results at a fraction of the cost.",
      },
    ],
  },
  hazardlens: {
    title: "HazardLens",
    subtitle: "Real-time construction safety detection pipeline using YOLO26 at 15+ FPS",
    timeline: "Feb 2026",
    role: "Solo Developer",
    stack: ["Python", "YOLO26", "OpenCV", "FastAPI", "React"],
    github: "https://github.com/Smear6uard/HazardLens",
    metrics: [
      { label: "Inference Speed", value: "15+ FPS" },
      { label: "Detection Model", value: "YOLO26" },
      { label: "Event Types", value: "Multi-class" },
      { label: "Alerting", value: "Real-time" },
    ],
    content: [
      { type: "heading", level: 2, content: "The Problem" },
      {
        type: "text",
        content:
          "Construction sites are among the most dangerous work environments. PPE compliance monitoring is typically manual, intermittent, and reactive — violations are caught after incidents, not before them.",
      },
      { type: "heading", level: 2, content: "The Insight" },
      {
        type: "text",
        content:
          "YOLO26's NMS-free inference architecture eliminates the post-processing bottleneck that limits real-time detection pipelines. Combined with centroid-based object tracking, you can monitor compliance continuously without sacrificing frame rate.",
      },
      { type: "heading", level: 2, content: "The Solution" },
      { type: "heading", level: 3, content: "Detection Pipeline" },
      {
        type: "text",
        content:
          "Built a real-time video processing pipeline that handles multi-class PPE compliance classification with centroid object tracking across frames:",
      },
      {
        type: "list",
        items: [
          "YOLO26 NMS-free inference for hard hats, safety vests, gloves, and goggles at 15+ FPS",
          "Centroid-based object tracking maintains identity across frames without re-identification overhead",
          "Temporal event detection identifies zone violations, PPE removal mid-shift, and near-miss incidents",
          "Severity-based alerting with risk scoring triggers appropriate response levels",
        ],
      },
      {
        type: "code",
        language: "python",
        filename: "detector.py",
        content: `class SafetyDetector:
    def process_frame(self, frame: np.ndarray) -> DetectionResult:
        # YOLO26 NMS-free inference
        detections = self.model.predict(frame, conf=0.5)

        # Update centroid tracker
        tracked = self.tracker.update(detections)

        # Temporal event analysis
        events = self.event_detector.analyze(
            tracked,
            zone_boundaries=self.zones,
            ppe_history=self.compliance_log
        )

        # Risk scoring and alerting
        for event in events:
            severity = self.risk_scorer.evaluate(event)
            if severity >= AlertLevel.WARNING:
                self.alert_system.trigger(event, severity)

        return DetectionResult(tracked, events)`,
      },
      { type: "heading", level: 3, content: "Live Dashboard" },
      {
        type: "text",
        content:
          "React-based compliance analytics dashboard with real-time metrics, violation heatmaps, and shift-level safety scoring. FastAPI backend streams detection events via WebSocket for instant updates.",
      },
      { type: "heading", level: 2, content: "Results" },
      {
        type: "callout",
        variant: "success",
        content:
          "Processing video at 15+ FPS with multi-class PPE detection, temporal event tracking, and real-time severity-based alerting across an entire construction site feed.",
      },
      { type: "heading", level: 2, content: "Reflections" },
      {
        type: "text",
        content:
          "The biggest challenge was temporal event detection — distinguishing between a worker briefly adjusting their hard hat vs. actually removing PPE. Sliding window analysis over tracked object states solved most false positives, but edge cases around occlusion required careful tuning of the tracker's confidence decay.",
      },
    ],
  },
  "llm-router": {
    title: "Intelligent LLM Router",
    subtitle: "Smart routing layer that cuts LLM API costs by up to 40% with under 50ms overhead",
    timeline: "Feb 2026",
    role: "Solo Developer",
    stack: ["Python", "FastAPI", "React", "OpenRouter"],
    github: "https://github.com/Smear6uard/Intelligent-LLM-Router",
    metrics: [
      { label: "Cost Reduction", value: "Up to 40%" },
      { label: "Routing Overhead", value: "<50ms" },
      { label: "Task Types", value: "7" },
      { label: "Models Supported", value: "4+" },
    ],
    content: [
      { type: "heading", level: 2, content: "The Problem" },
      {
        type: "text",
        content:
          "Most applications send every prompt to the same expensive model. A simple greeting gets the same GPT-4o treatment as a complex multi-step reasoning task. This wastes money and adds unnecessary latency.",
      },
      { type: "heading", level: 2, content: "The Insight" },
      {
        type: "text",
        content:
          "Prompt complexity is predictable. By analyzing 6 weighted signals — token count, vocabulary diversity, question depth, domain specificity, reasoning requirements, and output format — you can classify tasks into 7 types and route each to the cheapest model that handles it well.",
      },
      { type: "heading", level: 2, content: "The Solution" },
      { type: "heading", level: 3, content: "Routing Engine" },
      {
        type: "text",
        content:
          "The router classifies incoming prompts and selects the optimal model from GPT-4o, Claude, Gemini, or DeepSeek based on task type and cost efficiency:",
      },
      {
        type: "code",
        language: "python",
        filename: "router.py",
        content: `class LLMRouter:
    def route(self, prompt: str) -> ModelSelection:
        # Extract 6 weighted signals
        signals = self.analyzer.extract_signals(prompt)

        # Classify into 7 task types
        task_type = self.classifier.predict(signals)

        # Select optimal model for task
        model = self.model_selector.select(
            task_type=task_type,
            budget=self.cost_constraints,
            latency_target=self.latency_sla
        )

        return ModelSelection(
            model=model,
            confidence=signals.confidence,
            estimated_cost=model.estimate_cost(prompt)
        )`,
      },
      { type: "heading", level: 3, content: "A/B Testing Arena" },
      {
        type: "text",
        content:
          "Built a real-time analytics dashboard with an A/B testing arena that compares latency, accuracy, and cost across 3+ LLMs simultaneously. The dashboard surfaces which model performs best for each task type, enabling continuous routing optimization.",
      },
      { type: "heading", level: 2, content: "Results" },
      {
        type: "callout",
        variant: "success",
        content:
          "Cuts API costs by up to 40% by routing simple tasks to cheaper models, with under 50ms routing overhead. The A/B testing arena validated that cheaper models match expensive ones on 60%+ of typical prompts.",
      },
      { type: "heading", level: 2, content: "Reflections" },
      {
        type: "text",
        content:
          "The hardest part was calibrating the complexity classifier. Early versions over-routed to expensive models because they weighted token count too heavily. Vocabulary diversity and reasoning chain depth turned out to be much stronger signals for actual task difficulty.",
      },
    ],
  },
  deepcite: {
    title: "DeepCite",
    subtitle:
      "AI research engine with dual-mode retrieval processing 100+ URLs/hr with inline citations",
    timeline: "Oct 2025 – Jan 2026",
    role: "Solo Developer",
    stack: ["Next.js", "TypeScript", "Groq", "Redis", "Puppeteer"],
    github: "https://github.com/Smear6uard/DeepCite",
    live: "https://deep-cite-git-main-sameer-akhtars-projects.vercel.app/",
    metrics: [
      { label: "URLs/Hour", value: "100+" },
      { label: "Perceived Latency", value: "<100ms" },
      { label: "Retrieval Modes", value: "Dual" },
      { label: "Components", value: "10+" },
    ],
    content: [
      { type: "heading", level: 2, content: "The Problem" },
      {
        type: "text",
        content:
          "AI search tools either scrape poorly or synthesize poorly. Most fail to handle JavaScript-rendered pages, rate-limit themselves on parallel requests, or generate answers without verifiable citations. Research still requires dozens of open tabs.",
      },
      { type: "heading", level: 2, content: "The Insight" },
      {
        type: "text",
        content:
          "A dual-mode retrieval strategy — fast static scraping that falls back to headless rendering only when needed — handles 90%+ of pages via the cheap path while still capturing JS-heavy content. Redis caching eliminates redundant fetches across queries.",
      },
      { type: "heading", level: 2, content: "The Solution" },
      { type: "heading", level: 3, content: "Retrieval Pipeline" },
      {
        type: "text",
        content:
          "Engineered a dual-mode pipeline that maximizes throughput while maintaining content quality:",
      },
      {
        type: "list",
        items: [
          "Cheerio for fast static HTML parsing (primary path, <50ms per page)",
          "Puppeteer fallback for JavaScript-rendered content (triggered on empty content detection)",
          "Serper web search API for real-time source discovery",
          "Redis caching layer for deduplication across queries",
          "Promise.allSettled for parallel scraping with graceful failure handling",
        ],
      },
      {
        type: "code",
        language: "typescript",
        filename: "retrieval.ts",
        content: `async function retrieveSources(query: string): Promise<Source[]> {
  // Check Redis cache first
  const cached = await redis.get(\`query:\${hash(query)}\`);
  if (cached) return JSON.parse(cached);

  // Discover sources via Serper
  const urls = await serper.search(query, { num: 10 });

  // Parallel dual-mode scraping
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const static_ = await cheerio.extract(url);
      if (static_.contentLength < MIN_THRESHOLD) {
        return puppeteer.render(url);
      }
      return static_;
    })
  );

  const sources = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  await redis.set(\`query:\${hash(query)}\`, JSON.stringify(sources));
  return sources;
}`,
      },
      { type: "heading", level: 3, content: "Streaming UI" },
      {
        type: "text",
        content:
          "Built LLM streaming with pipeline status updates via server-sent events, achieving sub-100ms perceived latency. The frontend renders inline source citations across 10+ modular React components, with real-time pipeline progress indicators.",
      },
      { type: "heading", level: 2, content: "Results" },
      {
        type: "callout",
        variant: "success",
        content:
          "Processes 100+ URLs/hr via parallel scraping with sub-100ms perceived latency through SSE streaming. Redis caching eliminates redundant fetches, and the dual-mode pipeline handles both static and JS-rendered pages reliably.",
      },
      { type: "heading", level: 2, content: "Reflections" },
      {
        type: "text",
        content:
          "The biggest challenge was handling unreliable external URLs — timeouts, rate limits, malformed HTML, and anti-bot detection. Promise.allSettled was critical for graceful degradation, but tuning timeout thresholds and retry logic for the Puppeteer fallback path required extensive real-world testing.",
      },
    ],
  },
};

export function getProject(slug: string): Project | undefined {
  return projects[slug];
}

export function getAllProjectSlugs(): string[] {
  return Object.keys(projects);
}

// Pre-renders code blocks to colored HTML. Inputs come exclusively from the
// static `projects` object above (developer-controlled, never user input).
// HTML entities are escaped before tokens are wrapped, so the resulting
// string is safe to render as HTML inside <pre><code>.
export function highlightCode(code: string, language: string): string {
  const keywords: Record<string, string[]> = {
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
    java: [
      "public",
      "private",
      "class",
      "void",
      "int",
      "boolean",
      "return",
      "if",
      "else",
      "while",
      "new",
      "List",
    ],
  };

  let highlighted = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  highlighted = highlighted.replace(
    /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
    '<span class="text-green-400">$&</span>',
  );

  highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-text-muted">$1</span>');

  const langKeywords = keywords[language] || keywords.typescript;
  langKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, "g");
    highlighted = highlighted.replace(regex, '<span class="text-purple-400">$1</span>');
  });

  return highlighted;
}

export type ProcessedContentBlock =
  | Exclude<ContentBlock, { type: "code" }>
  | (Extract<ContentBlock, { type: "code" }> & { highlightedCode: string });

export function processContentBlocks(content: ContentBlock[]): ProcessedContentBlock[] {
  return content.map((block) => {
    if (block.type === "code") {
      return {
        ...block,
        highlightedCode: highlightCode(block.content, block.language),
      };
    }
    return block;
  });
}
