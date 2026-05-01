import { useState } from 'react'

const TABS = [
  {
    id: 'languages',
    label: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Swift', 'SQL', 'C++'],
  },
  {
    id: 'frameworks',
    label: 'Frameworks',
    items: [
      'React',
      'TanStack Start',
      'Next.js',
      'SwiftUI',
      'FastAPI',
      'Hono',
      'Tailwind',
      'Angular',
    ],
  },
  {
    id: 'devtools',
    label: 'Dev Tools',
    items: ['Git', 'Docker', 'Vite', 'pnpm', 'Vercel', 'GitHub Actions', 'Linear', 'Figma'],
  },
  {
    id: 'aiml',
    label: 'AI/ML',
    items: [
      'PyTorch',
      'YOLO',
      'OpenCV',
      'BiRefNet',
      'Florence-2',
      'FashionSigLIP',
      'Gemini',
      'Claude',
      'OpenAI',
    ],
  },
] as const

type TabId = (typeof TABS)[number]['id']

export function TechStack() {
  const [active, setActive] = useState<TabId>('languages')
  const activeTab = TABS.find((t) => t.id === active) ?? TABS[0]

  return (
    <div className="about-card">
      <div className="about-card-eyebrow">
        <span className="about-card-eyebrow-label">Tech Stack</span>
      </div>

      <div className="tech-stack-tabs" role="tablist" aria-label="Tech stack categories">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            className={`tech-stack-tab ${active === tab.id ? 'tech-stack-tab--active' : ''}`}
            onClick={() => {
              setActive(tab.id)
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tech-stack-tags" role="tabpanel" aria-label={activeTab.label}>
        {activeTab.items.map((item) => (
          <span key={item} className="tech-stack-tag">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
