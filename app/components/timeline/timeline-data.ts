export type TimelineEntry = {
  id: string
  company: string
  dates: string
  role: string
  description: string
  stack: readonly string[]
}

export type TimelineGroup = {
  year: string
  entries: readonly TimelineEntry[]
}

export const TIMELINE_GROUPS: readonly TimelineGroup[] = [
  {
    year: '2025',
    entries: [
      {
        id: 'styleum',
        company: 'Styleum',
        dates: 'Dec 2025 to Present',
        role: 'Founder & Engineer',
        description:
          'Architected a 5-stage ML pipeline (BiRefNet, Florence-2, FashionSigLIP, AWS Rekognition, Gemini) for AI outfit generation at $0.002 per outfit. Built full-stack iOS app (Swift / SwiftUI / Hono / TypeScript) and shipped to the App Store in 8 weeks as sole engineer.',
        stack: ['Swift', 'SwiftUI', 'Hono', 'TypeScript', 'AWS', 'Gemini'],
      },
      {
        id: 'brunosoft',
        company: 'Brunosoft',
        dates: 'Oct 2025 to Present',
        role: 'Software Engineering Intern',
        description:
          'Migrated 100+ AngularJS components to modern Angular with lazy-loaded routing and modular state management. Containerized development and production environments with Docker, reducing local setup time from hours to minutes. Implemented CI/CD workflows for safer release cycles.',
        stack: ['Angular', 'TypeScript', 'Docker', 'CI/CD'],
      },
      {
        id: 'apple',
        company: 'Apple',
        dates: 'Jul 2025 to Nov 2025',
        role: 'Specialist',
        description:
          'Diagnosed and resolved iOS and macOS issues for 50+ clients monthly, focused on enterprise MDM configurations and multi-device sync failures. Maintained a 95%+ customer satisfaction rating.',
        stack: ['iOS', 'macOS', 'MDM'],
      },
    ],
  },
  {
    year: '2022',
    entries: [
      {
        id: 'acl',
        company: 'American Coach Limousine',
        dates: 'Jul 2022 to Feb 2024',
        role: 'Systems Integration Specialist',
        description:
          'Integrated FastTrak booking API with internal dispatch via REST, automating reservations across 50+ affiliate partners. Built workflows that improved coordination for 15+ corporate accounts and reduced manual data entry across 3,000+ weekly bookings.',
        stack: ['REST', 'API integration', 'Dispatch systems'],
      },
    ],
  },
] as const
