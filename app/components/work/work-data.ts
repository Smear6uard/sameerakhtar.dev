export type WorkLink = {
  label: string
  href: string
  external?: boolean
  toCaseStudy?: boolean
}

export type WorkProject = {
  id: string
  index: string
  tag: string
  title: string
  metric: string
  description: string
  stack: readonly string[]
  links: readonly WorkLink[]
  caseStudySlug: string
  pipelineId: string
}

export const WORK_PROJECTS: readonly WorkProject[] = [
  {
    id: 'styleum',
    index: '01',
    tag: 'ML PIPELINE',
    title: 'Styleum',
    metric: '$0.002 / outfit',
    description:
      'A 5-stage ML pipeline (BiRefNet, Florence-2, FashionSigLIP, AWS Rekognition, Gemini) generating AI styled outfits at $0.002 each, 40% below competitor costs. Full-stack iOS app shipped to the App Store in 8 weeks as sole engineer.',
    stack: ['Swift', 'SwiftUI', 'Hono', 'TypeScript', 'AWS', 'Gemini'],
    links: [{ label: 'live', href: 'https://apps.apple.com/styleum-link', external: true }],
    caseStudySlug: 'styleum',
    pipelineId: 'styleum',
  },
  {
    id: 'hazardlens',
    index: '02',
    tag: 'VISION SYSTEM',
    title: 'HazardLens',
    metric: '15+ FPS',
    description:
      'Real-time construction safety detection using YOLO26 NMS-free inference at 15+ FPS. Temporal event detection identifies zone violations, PPE removal, and near-miss incidents with severity-based alerting.',
    stack: ['Python', 'YOLO26', 'PyTorch', 'FastAPI', 'Redis', 'WebSockets'],
    links: [
      { label: 'view case study', href: '/work/hazardlens', toCaseStudy: true },
      { label: 'github', href: 'https://github.com/sameerakhtar/hazardlens', external: true },
    ],
    caseStudySlug: 'hazardlens',
    pipelineId: 'hazardlens',
  },
  {
    id: 'llm-router',
    index: '03',
    tag: 'ROUTING LAYER',
    title: 'Intelligent LLM Router',
    metric: '40% cost reduction',
    description:
      'A routing layer classifying prompt complexity using 6 weighted signals to select between providers (GPT-4, Claude, Gemini, DeepSeek), cutting API costs ~40% while preserving response quality.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Anthropic', 'OpenAI'],
    links: [
      { label: 'view case study', href: '/work/llm-router', toCaseStudy: true },
      { label: 'github', href: 'https://github.com/sameerakhtar/llm-router', external: true },
    ],
    caseStudySlug: 'llm-router',
    pipelineId: 'llm-router',
  },
] as const
