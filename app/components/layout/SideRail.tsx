type SideRailProps = {
  side: 'left' | 'right'
}

export function SideRail({ side }: SideRailProps) {
  const positionClass = side === 'left' ? 'left-0 border-r' : 'right-0 border-l'
  const widthClass = side === 'left' ? 'w-[var(--rail-left)]' : 'w-[var(--rail-right)]'

  return (
    <div
      aria-hidden="true"
      className={`${positionClass} ${widthClass} border-border fixed top-0 bottom-0 z-20`}
    />
  )
}
