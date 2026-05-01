import { useEffect, useState } from 'react'

import { ThemeToggle } from '@/components/theme/ThemeToggle'

const navItems = [
  { label: 'index', href: '/' },
  { label: 'work', href: '/#work' },
  { label: 'writing', href: '/writing' },
] as const

export function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <>
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
            <nav aria-label="Primary" className="hidden items-center gap-5 md:flex">
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

            <button
              type="button"
              className="text-fg hover:text-accent focus-visible:outline-accent font-mono text-[0.65rem] leading-none font-medium tracking-[0.18em] uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 md:hidden"
              onClick={() => {
                setMenuOpen((v) => !v)
              }}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? 'close' : 'menu'}
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="bg-bg fixed inset-0 z-40 flex flex-col md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="border-border h-topbar flex items-center justify-between border-b pr-[calc(var(--rail-right)+1rem)] pl-[calc(var(--rail-left)+1rem)]">
            <span className="text-fg font-mono text-[0.7rem] leading-none font-medium uppercase">
              menu
            </span>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
              }}
              className="text-fg hover:text-accent focus-visible:outline-accent font-mono text-[0.65rem] leading-none font-medium tracking-[0.18em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4"
              aria-label="Close menu"
            >
              close
            </button>
          </div>

          <nav
            aria-label="Primary mobile"
            className="flex flex-1 flex-col items-start justify-center gap-7 pr-[calc(var(--rail-right)+1rem)] pl-[calc(var(--rail-left)+1.5rem)]"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => {
                  setMenuOpen(false)
                }}
                className="text-fg hover:text-accent font-mono text-3xl font-medium tracking-tight lowercase transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
