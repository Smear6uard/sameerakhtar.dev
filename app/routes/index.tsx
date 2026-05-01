import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

function HomeRoute() {
  return (
    <section className="grid min-h-[calc(100dvh-var(--topbar-height)-3.5rem)] place-items-center px-6">
      <p className="text-fg-3 font-mono text-xs leading-none font-medium uppercase">
        phase 2: hero
      </p>
    </section>
  )
}
