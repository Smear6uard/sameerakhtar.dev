import { createContext, useCallback, useMemo, useState, type PropsWithChildren } from 'react'

import { DEFAULT_THEME, isTheme, THEME_STORAGE_KEY, type Theme } from '@/lib/theme'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

function readDocumentTheme(): Theme {
  if (typeof document === 'undefined') {
    return DEFAULT_THEME
  }

  const currentTheme = document.documentElement.dataset.theme ?? null

  return isTheme(currentTheme) ? currentTheme : DEFAULT_THEME
}

function commitTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>(readDocumentTheme)

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
    commitTheme(nextTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'
      commitTheme(nextTheme)
      return nextTheme
    })
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
