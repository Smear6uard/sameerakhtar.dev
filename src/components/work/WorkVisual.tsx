// Small architecture diagrams for each project. Coordinates are percentages
// of the panel; edges are index pairs into `nodes`.

type VisualNode = { label: string; detail: string; x: number; y: number };

type Visual = {
  eyebrow: string;
  nodes: VisualNode[];
  edges: [number, number][];
};

const visuals: Record<string, Visual> = {
  renaro: {
    eyebrow: "Dispatch platform",
    nodes: [
      { label: "Bookings", detail: "phone · web · app", x: 12, y: 50 },
      { label: "Dispatch", detail: "driver scoring", x: 37, y: 28 },
      { label: "Drivers", detail: "mobile + GPS", x: 63, y: 28 },
      { label: "Outbox", detail: "SKIP LOCKED", x: 37, y: 72 },
      { label: "Ledger", detail: "Stripe Connect", x: 63, y: 72 },
      { label: "Audit", detail: "every change", x: 88, y: 50 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [3, 4],
      [2, 5],
      [4, 5],
    ],
  },
  "brand-discovery": {
    eyebrow: "GenAI pipeline",
    nodes: [
      { label: "Source", detail: "URL or PDF", x: 12, y: 50 },
      { label: "Render", detail: "Cloud Run", x: 37, y: 28 },
      { label: "Measure", detail: "palette + WCAG", x: 63, y: 28 },
      { label: "Gemini", detail: "schema output", x: 63, y: 72 },
      { label: "Workers", detail: "Go + Redis", x: 37, y: 72 },
      { label: "Theme", detail: "survey theme", x: 88, y: 50 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [0, 4],
      [4, 1],
      [3, 5],
    ],
  },
  styleum: {
    eyebrow: "Vision + LLM pipeline",
    nodes: [
      { label: "Wardrobe", detail: "one photo each", x: 12, y: 50 },
      { label: "Segment", detail: "BiRefNet", x: 37, y: 28 },
      { label: "Attributes", detail: "Florence-2", x: 63, y: 28 },
      { label: "Embed", detail: "FashionSigLIP", x: 63, y: 72 },
      { label: "Weather", detail: "local forecast", x: 37, y: 72 },
      { label: "4 outfits", detail: "Gemini · 9 AM", x: 88, y: 50 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 5],
      [4, 5],
    ],
  },
  hazardlens: {
    eyebrow: "Detection pipeline",
    nodes: [
      { label: "Video", detail: "OpenCV decode", x: 12, y: 50 },
      { label: "YOLO26", detail: "NMS-free", x: 37, y: 28 },
      { label: "Tracker", detail: "centroids", x: 63, y: 28 },
      { label: "Zones", detail: "polygons", x: 37, y: 72 },
      { label: "Events", detail: "temporal rules", x: 63, y: 72 },
      { label: "Dashboard", detail: "SSE + WS", x: 88, y: 50 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [3, 4],
      [2, 4],
      [4, 5],
    ],
  },
  windwalk: {
    eyebrow: "Routing",
    nodes: [
      { label: "Pedway", detail: "40+ nodes", x: 12, y: 30 },
      { label: "Streets", detail: "surface edges", x: 12, y: 70 },
      { label: "Wind", detail: "OpenWeatherMap", x: 37, y: 70 },
      { label: "Weights", detail: "exposure cost", x: 63, y: 50 },
      { label: "Dijkstra", detail: "merged graph", x: 63, y: 20 },
      { label: "Route", detail: "Expo + Mapbox", x: 88, y: 50 },
    ],
    edges: [
      [0, 4],
      [1, 3],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
  },
  "llm-router": {
    eyebrow: "Routing layer",
    nodes: [
      { label: "Prompt", detail: "request", x: 12, y: 50 },
      { label: "Signals", detail: "6 features", x: 37, y: 28 },
      { label: "Classifier", detail: "7 task types", x: 63, y: 28 },
      { label: "Budget", detail: "cost rules", x: 37, y: 72 },
      { label: "Selector", detail: "latency + fit", x: 63, y: 72 },
      { label: "Model", detail: "cheapest fit", x: 88, y: 50 },
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
    nodes: [
      { label: "Query", detail: "research", x: 12, y: 50 },
      { label: "Search", detail: "Serper", x: 37, y: 28 },
      { label: "Parse", detail: "Cheerio", x: 63, y: 28 },
      { label: "Render", detail: "Puppeteer", x: 63, y: 72 },
      { label: "Cache", detail: "Redis", x: 37, y: 72 },
      { label: "Answer", detail: "citations", x: 88, y: 50 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [0, 4],
      [2, 5],
      [3, 5],
    ],
  },
};

export function WorkVisual({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const visual = visuals[slug] ?? visuals["llm-router"];

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-elev"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklab, var(--ink) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--ink) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {visual.edges.map(([from, to], index) => {
          const a = visual.nodes[from];
          const b = visual.nodes[to];
          return (
            <line
              key={index}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              vectorEffect="non-scaling-stroke"
              stroke="var(--accent)"
              strokeOpacity={0.55}
              strokeWidth={1.25}
              strokeDasharray="3 4"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      <p className="eyebrow absolute top-4 left-4">{visual.eyebrow}</p>

      {visual.nodes.map((node) => (
        <div
          key={node.label}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-md border border-line bg-bg shadow-[var(--shadow)] ${
            compact ? "w-[5.5rem] px-2 py-1" : "w-[clamp(5.25rem,9.5vw,6.5rem)] px-2 py-1.5"
          }`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <p className="truncate text-[11px] font-medium text-ink md:text-xs">{node.label}</p>
          <p className="mt-0.5 truncate font-mono text-[9.5px] text-ink-3">{node.detail}</p>
        </div>
      ))}
    </div>
  );
}
