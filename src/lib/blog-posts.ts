export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "making-styleum",
    title: "Making Styleum: From Closet Scan to Daily Outfit",
    description:
      "What it took to turn a five-stage fashion ML pipeline into an iOS app people could use every morning.",
    date: "2026-07-14",
    readingTime: "7 min read",
    tags: ["Styleum", "iOS", "AI", "Startups"],
    content: `
Styleum started with a simple frustration: getting dressed should not require twenty minutes of scrolling, searching, and second-guessing. Most wardrobe apps made the setup feel like work before they offered anything useful.

I wanted the opposite experience. Scan what you own, learn what works together, and open the app to a useful outfit—not another empty dashboard.

Eight weeks after the first commit, Styleum was on the App Store. Getting there meant building much more than an AI prompt.

## Start With the Time to Value

The first product decision was also the most important: a new user had to see value quickly.

That changed how I thought about onboarding. Instead of asking someone to manually catalog every detail, Styleum uses the camera and a vision pipeline to do the tedious work. The app removes the background, identifies the garment, extracts useful attributes, and turns the result into a representation the recommendation system can search.

The goal was not to collect the most data. It was to collect the smallest amount of data needed to make a good first outfit.

## The Five-Stage Pipeline

No single model was good enough, fast enough, and cheap enough for the entire job. Styleum uses specialized models, with each stage responsible for one narrow task:

- **BiRefNet** isolates each garment from its background
- **Florence-2** extracts category, color, pattern, and other attributes
- **FashionSigLIP** creates fashion-specific embeddings for similarity and retrieval
- **AWS Rekognition** helps model body proportions when a user chooses to provide a photo
- **Gemini** composes the final outfit and explains why the pieces work together

This architecture took more engineering than sending an image to one general-purpose model, but it produced better fashion results and kept the cost near $0.002 per generated outfit.

\`\`\`typescript
async function buildDailyOutfit(wardrobe: Garment[]) {
  const candidates = await retrieveCompatiblePieces(wardrobe);
  const context = await buildStyleContext(candidates);

  return composeOutfit({
    candidates,
    context,
    constraints: ["weather", "occasion", "recently_worn"],
  });
}
\`\`\`

## Build the Product Around the Pipeline

An ML pipeline is not a product by itself. Models fail, uploads stall, permissions get denied, and people close the app halfway through a scan.

The iOS client is built in SwiftUI, with a Hono and TypeScript backend coordinating the model stages. I treated every pipeline boundary as a recoverable state. A scan can retry without duplicating a garment. A partial wardrobe remains usable. Slow stages report progress instead of freezing the interface.

Those details mattered more to the experience than another percentage point on a benchmark.

## Daily Outfits Need Memory

The first version could generate a plausible outfit, but plausible is not the same as personal. A daily styling product needs to remember what it suggested, what the user wore, and what they skipped.

I added lightweight preference signals and recent-outfit history so the system would not recommend the same combination every day. Weather and occasion act as constraints, while garment embeddings provide the candidate pool. The generative model works near the end of the process instead of deciding everything from scratch.

That made the output more consistent and made each request cheaper.

## Shipping in Eight Weeks

The schedule forced clear choices:

- Native iOS interactions were worth the investment because the camera is central to the product
- Specialized models were worth the integration cost because fashion retrieval quality was a core feature
- Observability had to ship with the pipeline so failed stages and per-outfit cost were visible
- Features that did not improve the first scan or the next morning's outfit waited

I also built notification scheduling, streaks, and XP as supporting systems. They were useful only after the core loop—scan, generate, wear, return—worked reliably.

## What I Would Do Differently

I would instrument onboarding earlier. I initially measured successful outfit generation, but the more useful question was where users stopped before their first outfit. That data changed small pieces of copy, permission timing, and progress feedback.

I would also build the model evaluation set alongside the first pipeline prototype. Fashion quality is subjective, but a consistent set of wardrobes and occasions makes regressions much easier to spot.

## What Making Styleum Taught Me

The biggest lesson was that good AI products hide model complexity without hiding system state. Users do not need to know which vision model is running, but they do need to know that their scan is progressing, that a retry is safe, and why an outfit was suggested.

Styleum became real when the pipeline stopped feeling like a demo and started behaving like dependable software. The model choices mattered. The recovery paths, cost controls, and product constraints are what made it shippable.

---

*Styleum is available on the [App Store](https://apps.apple.com/us/app/styleum-daily-fits/id6757777880).*
    `.trim(),
  },
  {
    slug: "building-ai-pipeline-002-per-call",
    title: "Building an AI Pipeline at $0.002/Call",
    description:
      "How I cut AI costs by 10x while building Styleum by routing requests through a hybrid model pipeline.",
    date: "2025-01-10",
    readingTime: "6 min read",
    tags: ["AI", "Startups", "Engineering"],
    content: `
When I started building Styleum, I faced a problem every AI startup hits: API costs.

The naive approach—sending every styling request directly to GPT-4—would cost $0.02+ per call. At scale, that's unsustainable. I needed a way to deliver personalized fashion recommendations without burning through runway.

Here's how I got it down to $0.002 per call.

## The Problem with Direct API Calls

Most AI features follow a simple pattern:

\`\`\`typescript
async function getStyleAdvice(userQuery: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: userQuery }],
  });
  return response.choices[0].message.content;
}
\`\`\`

Simple. Works. Expensive.

Every request—whether "What color shirt goes with navy pants?" or "Build me a complete capsule wardrobe for fall"—hits the same expensive model. The simple query costs as much as the complex one.

## The Insight: Not All Requests Are Equal

After analyzing user queries, I noticed a pattern:

- **60% were simple** ("Does this match?", "What shoes go with X?")
- **30% were moderate** ("Suggest an outfit for a business casual meeting")
- **10% were complex** ("Create a personalized style guide based on my preferences")

Why use a $20M model for "does blue go with gray"?

## The Solution: A Two-Stage Pipeline

\`\`\`typescript
async function routeStyleRequest(request: StyleRequest) {
  // Stage 1: Fast classification (~100ms, $0.0001)
  const classification = await classifyRequest(request);

  switch (classification.complexity) {
    case 'simple':
      // Rules + lightweight model
      return handleSimpleRequest(request);

    case 'moderate':
      // GPT-3.5-turbo with style context
      return handleModerateRequest(request);

    case 'complex':
      // Full GPT-4 with rich context
      return handleComplexRequest(request);
  }
}
\`\`\`

### Stage 1: Classification

The classifier is a fine-tuned GPT-3.5 model that categorizes requests. It's fast (~100ms) and cheap (~$0.0001/call). The prompt is simple:

\`\`\`
Classify this fashion query as SIMPLE, MODERATE, or COMPLEX:
- SIMPLE: Basic matching, yes/no questions, single-item suggestions
- MODERATE: Outfit building, occasion-specific advice
- COMPLEX: Wardrobe planning, style profile creation, multi-look suggestions

Query: {user_query}
Classification:
\`\`\`

### Stage 2: Routing

**Simple requests** (60%) hit a combination of rules and GPT-3.5:
- Color matching rules handle most "does X go with Y" questions
- A lightweight model fills gaps
- Cost: ~$0.0005/call

**Moderate requests** (30%) use GPT-3.5-turbo with injected style context:
- User's style preferences
- Current season/trends
- Wardrobe constraints
- Cost: ~$0.002/call

**Complex requests** (10%) get the full GPT-4 treatment:
- Rich user profile context
- Style history
- Multi-turn conversation capability
- Cost: ~$0.02/call

### The Math

**Before (naive approach):**
- 100% of requests → GPT-4 @ $0.02/call
- Average cost: **$0.02/call**

**After (hybrid pipeline):**
- 60% → Simple @ $0.0005 = $0.0003
- 30% → Moderate @ $0.002 = $0.0006
- 10% → Complex @ $0.02 = $0.002
- Average cost: **$0.0029/call**

That's a **7x reduction** in API costs. With some additional optimizations (caching common responses, batching where possible), I got it down to $0.002/call—a **10x improvement**.

## Lessons Learned

**1. Measure before optimizing.** I spent a week logging and categorizing requests before building the pipeline. Without that data, I would've optimized the wrong thing.

**2. Rules still work.** Not everything needs AI. Color theory rules handle 40% of simple requests faster and cheaper than any model.

**3. Context injection beats fine-tuning for most cases.** Instead of fine-tuning (expensive, slow to iterate), I inject user context into prompts. The model generalizes well.

**4. Build for observability.** Every request is logged with its classification, route taken, and cost. This lets me continuously refine the classifier.

## What's Next

The pipeline is working, but there's more to do:

- **Caching layer**: Common questions ("best colors for olive skin") should hit a cache
- **Classifier improvements**: The 10% complex bucket might be over-routing—some requests could be handled by moderate
- **Cost per user metrics**: Understanding CLTV vs. cost per user will inform pricing

The goal isn't just cheap AI—it's sustainable AI. If costs scale linearly with users, the business doesn't work. The hybrid approach breaks that relationship.

---

*Building something similar? I'm happy to chat about AI cost optimization. Reach out on [LinkedIn](https://linkedin.com/in/sameer-a-akhtar) or [email](mailto:sameer@sameerakhtar.dev).*
    `.trim(),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export function formatBlogDate(date: string, format: "short" | "long" = "short") {
  const localDate = new Date(`${date}T12:00:00`);

  return localDate.toLocaleDateString("en-US", {
    month: format === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}
