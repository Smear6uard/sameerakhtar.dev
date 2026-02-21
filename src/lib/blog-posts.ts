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
