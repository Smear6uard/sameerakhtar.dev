type VisualNode = {
  label: string;
  detail: string;
  x: number;
  y: number;
};

type ProjectVisual = {
  eyebrow: string;
  title: string;
  nodes: VisualNode[];
  edges: [number, number][];
  metric: string;
};

const visuals: Record<string, ProjectVisual> = {
  styleum: {
    eyebrow: "ML pipeline",
    title: "Wardrobe to outfit generation",
    metric: "$0.002/outfit",
    nodes: [
      { label: "Wardrobe", detail: "user photos", x: 14, y: 48 },
      { label: "Segmentation", detail: "BiRefNet", x: 34, y: 28 },
      { label: "Attributes", detail: "Florence-2", x: 54, y: 28 },
      { label: "Embeddings", detail: "FashionSigLIP", x: 54, y: 68 },
      { label: "Body Profile", detail: "Rekognition", x: 34, y: 68 },
      { label: "Outfit", detail: "Gemini", x: 80, y: 48 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [0, 4],
      [4, 3],
      [2, 5],
      [3, 5],
    ],
  },
  hazardlens: {
    eyebrow: "Vision system",
    title: "Site safety event detection",
    metric: "15+ FPS",
    nodes: [
      { label: "Camera Feed", detail: "live video", x: 14, y: 50 },
      { label: "YOLO26", detail: "PPE detection", x: 35, y: 30 },
      { label: "Tracker", detail: "centroids", x: 56, y: 30 },
      { label: "Zones", detail: "site map", x: 35, y: 70 },
      { label: "Risk Engine", detail: "severity", x: 56, y: 70 },
      { label: "Dashboard", detail: "alerts", x: 80, y: 50 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
      [2, 5],
      [4, 5],
    ],
  },
  "llm-router": {
    eyebrow: "Routing layer",
    title: "Prompt to optimal model",
    metric: "40% cost savings",
    nodes: [
      { label: "Prompt", detail: "request", x: 14, y: 50 },
      { label: "Signals", detail: "6 features", x: 34, y: 28 },
      { label: "Classifier", detail: "7 task types", x: 55, y: 28 },
      { label: "Budget", detail: "cost rules", x: 34, y: 70 },
      { label: "Selector", detail: "latency + fit", x: 55, y: 70 },
      { label: "Model", detail: "GPT/Claude/etc", x: 80, y: 50 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
      [2, 5],
      [4, 5],
    ],
  },
  deepcite: {
    eyebrow: "Retrieval engine",
    title: "Query to cited answer",
    metric: "100+ URLs/hr",
    nodes: [
      { label: "Query", detail: "research task", x: 14, y: 50 },
      { label: "Search", detail: "Serper", x: 34, y: 28 },
      { label: "Static Parse", detail: "Cheerio", x: 55, y: 28 },
      { label: "Render", detail: "Puppeteer", x: 55, y: 70 },
      { label: "Cache", detail: "Redis", x: 34, y: 70 },
      { label: "Answer", detail: "citations", x: 80, y: 50 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [0, 4],
      [4, 5],
      [2, 5],
      [3, 5],
    ],
  },
};

function getVisualKey(src: string, title: string) {
  const value = `${src} ${title}`.toLowerCase();
  if (value.includes("styleum")) return "styleum";
  if (value.includes("hazard")) return "hazardlens";
  if (value.includes("router") || value.includes("llm")) return "llm-router";
  if (value.includes("deepcite")) return "deepcite";
  return "llm-router";
}

export function ProjectArchitectureVisual({
  src = "",
  title,
  variant = "hero",
}: {
  src?: string;
  title: string;
  variant?: "hero" | "thumbnail";
}) {
  const visual = visuals[getVisualKey(src, title)];
  const compact = variant === "thumbnail";

  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(249,115,22,0.16),transparent_26%),linear-gradient(135deg,rgba(17,34,64,0.96),rgba(29,53,87,0.72))]">
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(230,241,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(230,241,255,0.12)_1px,transparent_1px)] [background-size:42px_42px]" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {visual.edges.map(([from, to], index) => {
          const start = visual.nodes[from];
          const end = visual.nodes[to];

          return (
            <line
              key={`${from}-${to}-${index}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              vectorEffect="non-scaling-stroke"
              className="stroke-accent/45"
              strokeWidth="1.25"
              strokeDasharray="4 5"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      <div className="absolute left-5 top-4 md:left-8 md:top-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent/80">
          {visual.eyebrow}
        </p>
        {!compact && (
          <h2 className="mt-2 max-w-[22rem] text-xl font-semibold text-text-primary md:text-3xl">
            {visual.title}
          </h2>
        )}
      </div>

      {visual.nodes.map((node) => (
        <div
          key={node.label}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/12 bg-bg-primary/86 shadow-[0_12px_34px_rgba(0,0,0,0.22)] backdrop-blur ${
            compact ? "w-[6.75rem] px-2 py-1.5" : "w-[clamp(6.75rem,14vw,10.5rem)] px-3 py-2.5"
          }`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <p className="truncate text-xs font-semibold text-text-primary md:text-sm">
            {node.label}
          </p>
          <p className="mt-0.5 truncate font-mono text-[10px] text-text-muted">{node.detail}</p>
        </div>
      ))}

      <div className="absolute bottom-4 right-5 rounded-md border border-accent/25 bg-accent/10 px-3 py-2 font-mono text-[11px] text-accent md:bottom-7 md:right-8">
        {visual.metric}
      </div>
    </div>
  );
}
