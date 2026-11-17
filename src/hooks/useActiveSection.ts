import { useEffect, useState } from "react";

// "work" spans every project stop on the ride, from Quantum Metric to the marquee.
const SECTIONS: Record<string, string> = {
  work: "work",
  renaro: "work",
  styleum: "work",
  "more-work": "work",
  about: "about",
  contact: "contact",
};

/** Tracks which home-page section is closest to the top of the viewport. */
export function useActiveSection(pathname: string) {
  const [active, setActive] = useState<string | null>(null);

  // Re-observe on every route change: the header outlives the page, so the
  // sections it watched on the last visit to the home page are gone.
  useEffect(() => {
    setActive(null);
    if (pathname !== "/") return;

    let observer: IntersectionObserver | null = null;
    let timer = 0;
    let tries = 0;

    // The route's sections can mount a moment after the path changes.
    const attach = () => {
      const elements = Object.keys(SECTIONS)
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);
      if (elements.length === 0) {
        if (tries++ < 20) timer = window.setTimeout(attach, 150);
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActive(SECTIONS[entry.target.id] ?? null);
          }
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
      );
      elements.forEach((el) => observer?.observe(el));
    };
    attach();

    const onTop = () => {
      if (window.scrollY < 200) setActive(null);
    };
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [pathname]);

  return active;
}
