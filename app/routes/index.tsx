import { createFileRoute } from '@tanstack/react-router'

import { Hero } from '@/components/hero/Hero'
import { Work } from '@/components/work/Work'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

function HomeRoute() {
  return (
    <>
      <Hero />
      <Work />
    </>
  )
}
