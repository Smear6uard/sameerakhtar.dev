// Résumé-derived content: experience, skills, education, honors.
// Mirrors public/Sameer_Akhtar_Resume.pdf — update both together.

export interface Role {
  company: string;
  title: string;
  period: string;
  location: string;
  href?: string;
  bullets: string[];
  tech: string;
}

export const experience: Role[] = [
  {
    company: "Quantum Metric",
    title: "Software Engineering Intern",
    period: "Jun 2026 – Present",
    location: "Remote",
    bullets: [
      "Owned AI Brand Discovery, a GenAI feature deriving survey branding from PDFs and websites, from pre-GA design to production launch; cut per-client branding setup from ~2 hours of manual work to under 5 minutes.",
      "Developed a Go + Gemini 2.5 Flash / Vertex AI pipeline with schema-constrained output and prompt-injection defenses; grounded colors in measured palettes with WCAG contrast checks to prevent hallucination.",
      "Built a Cloud Run + Playwright service for untrusted URLs; wrote Terraform for Direct VPC egress, Cloud NAT, OIDC auth, and deny-private-range firewall; SSRF-hardened by DNS pinning and redirect revalidation.",
      "Wrote Go workers with Redis-backed async orchestration, rate limiting, stale-job recovery, failure-aware retries, graceful shutdown draining, and cold-start egress validation; warm end-to-end renders complete in ~2–3s.",
    ],
    tech: "Go · Gemini 2.5 Flash · Vertex AI · Cloud Run · Playwright · Terraform · Redis · React · TypeScript",
  },
  {
    company: "Renaro",
    title: "Founder & Sole Engineer",
    period: "Mar 2026 – Present",
    location: "Chicago, IL",
    href: "https://renaroapp.com",
    bullets: [
      "Built and shipped a multi-tenant dispatch SaaS for taxi and limo fleets covering dispatch, payments, driver operations, messaging, and analytics; secured $3K+ in pre-launch revenue and prepared an operator pilot.",
      "Hardened WebSockets against a 10K-client reconnect storm (124 → 4,543 authenticated connections) and replaced per-tenant polling with a SKIP LOCKED batch claim, restoring 97% event delivery at simulated 3K-tenant load.",
      "Shipped Stripe Connect payments (ACH, disputes, refunds, payout holds, metered billing) on idempotent, webhook-deduplicated, compare-and-swap money paths.",
      "Enforced tenant isolation with forced PostgreSQL row-level security on every tenant table and CI schema gates; validated with an adversarial suite covering cross-tenant access and payment IDOR.",
    ],
    tech: "TypeScript · Fastify · PostgreSQL · Drizzle · pg-boss · Redis · WebSockets · Stripe Connect · WorkOS",
  },
  {
    company: "BrunoSoft",
    title: "Software Engineer Intern",
    period: "Oct 2025 – May 2026",
    location: "Remote",
    bullets: [
      "Migrated 100+ AngularJS components to modern Angular with lazy-loaded routing and modular state management, cutting production bundle size 30% and build time 40%; added unit and integration tests.",
      "Containerized dev and prod environments with Docker Compose, cutting setup from 2+ hours to 15 minutes.",
    ],
    tech: "Angular · TypeScript · Docker Compose · CI/CD",
  },
  {
    company: "American Coach Limousine",
    title: "Systems Integration Specialist",
    period: "Jul 2022 – Feb 2024",
    location: "Downers Grove, IL",
    bullets: [
      "Integrated the FastTrak booking API with internal dispatch via REST: 50+ affiliates, 3,000+ weekly bookings.",
    ],
    tech: "REST APIs · FastTrak · Dispatch operations",
  },
];

export const skills: { label: string; items: string[] }[] = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Go", "SQL", "Java", "Swift", "C++"],
  },
  {
    label: "Backend & data",
    items: [
      "Node.js",
      "Fastify",
      "PostgreSQL",
      "Drizzle",
      "pg-boss",
      "Redis",
      "REST",
      "WebSockets",
      "Stripe Connect",
      "WorkOS",
    ],
  },
  {
    label: "Frontend & mobile",
    items: ["React", "Next.js", "Angular", "React Native", "Expo", "SwiftUI", "Playwright"],
  },
  {
    label: "Cloud & infra",
    items: [
      "GCP (Cloud Run, Vertex AI)",
      "AWS",
      "Terraform",
      "Docker",
      "Cloudflare",
      "Vercel",
      "CI/CD",
      "GitHub Actions",
    ],
  },
  {
    label: "AI & CV",
    items: [
      "Gemini",
      "LLM APIs (OpenAI, Anthropic)",
      "PyTorch",
      "OpenCV",
      "YOLO",
      "BiRefNet",
      "Florence-2",
      "FashionSigLIP",
    ],
  },
];

/** Bento stat tiles. Numbers count up on scroll; strings render as-is. */
export const stats: { value: number | string; suffix?: string; label: string }[] = [
  { value: 4, suffix: "+", label: "years coding" },
  { value: 5, label: "products shipped" },
  { value: 100, suffix: "+", label: "app users" },
  { value: "1st", label: "DemonHacks 2026" },
];

export const education = {
  school: "DePaul University",
  degree: "B.S. Mathematics and Computer Science",
  gpa: "3.8 / 4.0",
  expected: "Expected June 2027",
  coursework: "Data Structures & Algorithms, Discrete Math, Computer Systems, Computer Networks",
};

export const honors: { title: string; detail?: string; href?: string; when: string }[] = [
  {
    title: "Muslim Tech Collaborative, DePaul chapter, project manager",
    when: "Sep 2026 – Present",
  },
  {
    title: "DemonHacks 2026, 1st place",
    detail: "WindWalk, weather-aware Dijkstra routing",
    href: "https://devpost.com/software/windwalk",
    when: "Mar 2026",
  },
  {
    title: "Muslim Tech Builders Newsletter, co-founder",
    detail: "500+ subscribers on Substack",
    href: "https://sameerakhtar.substack.com",
    when: "Feb 2025 – Present",
  },
];

/** Numbers that changed something, shown as a readout under the hero. */
export const proof = [
  { value: "4,543", label: "WebSocket connections held under a 10K-client reconnect storm" },
  { value: "~2–3 s", label: "warm end-to-end renders at Quantum Metric" },
  { value: "$0.002", label: "per generated outfit on Styleum" },
  { value: "1st", label: "place at DemonHacks 2026" },
];
