import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useActiveSection } from "@/hooks/useActiveSection";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#work", label: "Work", section: "work" },
  { href: "/#experience", label: "Experience", section: "experience" },
  { href: "/blog", label: "Writing", section: "blog" },
  { href: "/#about", label: "About", section: "about" },
] as const;

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = useActiveSection();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (item: (typeof NAV)[number]) => {
    if (item.section === "blog") return pathname.startsWith("/blog");
    if (item.section === "work") {
      return pathname.startsWith("/work") || (isHome && active === "work");
    }
    return isHome && active === item.section;
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open ? "border-line bg-bg/85 backdrop-blur-md" : "border-transparent",
      )}
    >
      <nav className="wrap flex h-16 items-center justify-between gap-6" aria-label="Primary">
        <Link
          href="/"
          className="font-medium tracking-[-0.01em] text-ink"
          onClick={() => setOpen(false)}
        >
          {site.name}
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[0.9375rem] transition-colors",
                isActive(item) ? "text-ink" : "text-ink-2 hover:text-ink",
              )}
              aria-current={isActive(item) ? "location" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
          >
            Resume
            <span aria-hidden="true">↗</span>
          </a>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-9 items-center rounded-full border border-line px-3.5 text-sm text-ink transition-colors hover:border-line-strong"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="border-t border-line bg-bg/95 backdrop-blur-md md:hidden"
          >
            <div className="wrap flex flex-col py-2">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-line py-3.5 text-lg text-ink last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={site.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-3 mb-3 self-start"
              >
                Resume
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
