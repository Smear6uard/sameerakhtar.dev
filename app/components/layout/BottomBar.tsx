export function BottomBar() {
  return (
    <footer className="border-border bg-bg/92 fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between gap-4 pr-[calc(var(--rail-right)+1rem)] pl-[calc(var(--rail-left)+1rem)]">
        <div className="text-fg-3 flex items-center gap-3 font-mono text-[0.65rem] leading-none font-medium uppercase">
          <span className="bg-fg-4 h-px w-8" aria-hidden="true" />
          <span>scroll</span>
        </div>

        <div className="text-fg-2 flex items-center gap-2 font-mono text-[0.65rem] leading-none font-medium uppercase">
          <span className="bg-accent size-1.5 rounded-full" aria-hidden="true" />
          <span>available</span>
        </div>
      </div>
    </footer>
  )
}
