import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      aria-pressed={theme === 'dark'}
      className="group border-border bg-bg text-fg hover:border-border-2 hover:text-accent focus-visible:outline-accent inline-grid size-10 place-items-center border transition-[background-color,border-color,color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 active:translate-y-px"
      onClick={toggleTheme}
      suppressHydrationWarning
    >
      <span className="sr-only">Toggle theme</span>
      <span aria-hidden="true" className="relative size-4">
        <svg
          className="theme-toggle-sun absolute inset-0 size-4 transition-[opacity,transform] duration-200"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 2.5V5M12 19v2.5M4.93 4.93 6.7 6.7M17.3 17.3l1.77 1.77M2.5 12H5M19 12h2.5M4.93 19.07 6.7 17.3M17.3 6.7l1.77-1.77"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
        <svg
          className="theme-toggle-moon absolute inset-0 size-4 transition-[opacity,transform] duration-200"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M19.3 14.2A7.4 7.4 0 0 1 9.8 4.7 7.7 7.7 0 1 0 19.3 14.2Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </span>
    </button>
  )
}
