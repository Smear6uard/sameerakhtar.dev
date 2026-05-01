import { createFileRoute } from '@tanstack/react-router'

import { Hero } from '@/components/hero/Hero'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

function HomeRoute() {
  return <Hero />
}
