import { ThemeToggle } from '@/components/theme/ThemeToggle'

const navItems = [
  { label: 'index', href: '/' },
  { label: 'work', href: '/#work' },
  { label: 'writing', href: '/writing' },
] as const

export function TopBar() {
  return (
    <header className="h-topbar border-border bg-bg/92 fixed inset-x-0 top-0 z-30 border-b backdrop-blur-sm">
      <div className="flex h-full items-center justify-between gap-6 pr-[calc(var(--rail-right)+1rem)] pl-[calc(var(--rail-left)+1rem)]">
        <a
          href="/"
          className="text-fg focus-visible:outline-accent font-mono text-[0.7rem] leading-none font-medium uppercase focus-visible:outline-2 focus-visible:outline-offset-4"
          aria-label="Sameer Akhtar home"
        >
          sameer.akhtar
        </a>

        <div className="flex items-center gap-5">
          <nav aria-label="Primary" className="hidden items-center gap-5 sm:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-fg hover:text-accent focus-visible:outline-accent font-mono text-[0.65rem] leading-none font-medium uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
