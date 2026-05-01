import type { PropsWithChildren } from 'react'

import { BottomBar } from '@/components/layout/BottomBar'
import { SideRail } from '@/components/layout/SideRail'
import { TopBar } from '@/components/layout/TopBar'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="bg-bg text-fg min-h-dvh">
      <TopBar />
      <SideRail side="left" />
      <SideRail side="right" />

      <div className="top-topbar fixed right-0 bottom-14 z-20 hidden w-[var(--rail-right)] items-center justify-center sm:flex">
        <p className="text-fg-3 font-mono text-[0.6rem] leading-none font-medium uppercase [writing-mode:vertical-rl]">
          sameerakhtar.dev
        </p>
      </div>

      <main className="pt-topbar min-h-dvh pr-[var(--rail-right)] pb-14 pl-[var(--rail-left)]">
        {children}
      </main>

      <BottomBar />
    </div>
  )
}
