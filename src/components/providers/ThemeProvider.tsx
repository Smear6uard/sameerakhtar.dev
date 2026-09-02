import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = "theme";
const ATTRIBUTE = "data-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* storage unavailable */
  }
  return "dark";
}

function applyTheme(theme: Theme): ResolvedTheme {
  const resolved: ResolvedTheme = theme === "system" ? getSystemTheme() : theme;
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute(ATTRIBUTE, resolved);
  }
  return resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");

  useEffect(() => {
    const stored = readStoredTheme();
    setThemeState(stored);
    setResolvedTheme(applyTheme(stored));
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolvedTheme(applyTheme("system"));
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    setResolvedTheme(applyTheme(next));
    try {
      if (next === "system") window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "dark" as Theme,
      resolvedTheme: "dark" as ResolvedTheme,
      setTheme: () => {},
    };
  }
  return ctx;
}

// Runs inline before hydration so the first paint already has the right
// theme. Dark is the default; a stored choice wins.
export const themeFoucScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");var d=document.documentElement;d.setAttribute("${ATTRIBUTE}",t==="light"?"light":"dark")}catch(e){document.documentElement.setAttribute("${ATTRIBUTE}","dark")}})();`;
