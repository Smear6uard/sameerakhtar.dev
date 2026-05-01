import { createFileRoute } from '@tanstack/react-router'

import { About } from '@/components/about/About'
import { Contact } from '@/components/contact/Contact'
import { Hero } from '@/components/hero/Hero'
import { PageFooter } from '@/components/layout/PageFooter'
import { Timeline } from '@/components/timeline/Timeline'
import { Work } from '@/components/work/Work'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

function HomeRoute() {
  return (
    <>
      <Hero />
      <Work />
      <Timeline />
      <About />
      <Contact />
      <PageFooter />
    </>
  )
}
