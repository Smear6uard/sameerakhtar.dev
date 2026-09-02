import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Magnetic } from "@/components/fx/Magnetic";
import { useActiveSection } from "@/hooks/useActiveSection";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#work", label: "work", section: "work" },
  { href: "/#experience", label: "experience", section: "experience" },
  { href: "/#about", label: "about", section: "about" },
  { href: "/blog", label: "blog", section: "blog" },
] as const;

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = useActiveSection();
  const isHome = pathname === "/";
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

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
        "sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300",
        scrolled || open ? "border-line bg-bg/80 backdrop-blur-md" : "border-transparent",
      )}
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-accent"
        style={{ scaleX: progress, boxShadow: "0 0 10px var(--glow)" }}
        aria-hidden="true"
      />
      <nav className="wrap flex h-16 items-center justify-between gap-6" aria-label="Primary">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-medium tracking-tight text-ink transition-colors hover:text-accent"
          onClick={() => setOpen(false)}
        >
          <img
            src="/SameerAkhtar.dev-logo-navybg.jpg"
            alt=""
            width={26}
            height={26}
            className="rounded-md"
          />
          <span>sameer akhtar</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[0.9375rem] transition-colors",
                isActive(item) ? "text-accent" : "text-ink-2 hover:text-accent",
              )}
              aria-current={isActive(item) ? "location" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Magnetic radius={70} strength={6}>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm border border-accent/50 text-accent hover:bg-accent/10 hover:shadow-[0_0_20px_var(--glow-soft)]"
            >
              resume
            </a>
          </Magnetic>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-9 items-center rounded-lg border border-line px-3.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {open ? "close" : "menu"}
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
                resume <span aria-hidden="true">↗</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
