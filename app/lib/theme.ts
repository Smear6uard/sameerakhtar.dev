export const THEME_STORAGE_KEY = 'sameer-akhtar-theme'

export const THEMES = ['light', 'dark'] as const

export type Theme = (typeof THEMES)[number]

export const DEFAULT_THEME: Theme = 'light'

export function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

export const themeInitScript = `
(function () {
  try {
    var key = '${THEME_STORAGE_KEY}';
    var stored = window.localStorage.getItem(key);
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored === 'light' || stored === 'dark' ? stored : prefersDark ? 'dark' : 'light';
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  } catch (_) {
    document.documentElement.dataset.theme = '${DEFAULT_THEME}';
    document.documentElement.style.colorScheme = '${DEFAULT_THEME}';
  }
})();
`
