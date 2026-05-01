import { createFileRoute, notFound } from '@tanstack/react-router'

import { CaseStudyShell } from '@/components/layout/CaseStudyShell'
import { WORK_PROJECTS } from '@/components/work/work-data'

export const Route = createFileRoute('/work/$slug')({
  loader: ({ params }) => {
    const project = WORK_PROJECTS.find((p) => p.caseStudySlug === params.slug)
    if (!project) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound()
    }
    return { project }
  },
  component: CaseStudyRoute,
})

function CaseStudyRoute() {
  const { project } = Route.useLoaderData()
  return (
    <CaseStudyShell tag={project.tag} title={project.title}>
      <p className="case-study-pending">Case study coming soon.</p>
    </CaseStudyShell>
  )
}
