import { site } from "@/lib/site";

const FOOTER_LINKS = [
  { label: "github", href: site.github },
  { label: "linkedin", href: site.linkedin },
  { label: "email", href: `mailto:${site.email}` },
  { label: "source", href: site.sourceRepo },
];

export function Footer() {
  return (
    <footer className="hairline relative z-10 mt-20">
      <div className="wrap flex flex-col gap-4 py-8 text-sm text-ink-3 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Sameer Akhtar · Built with TanStack Start, React 19, and
          Tailwind v4 · Last shipped {lastShipped()}
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="link-quiet"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

function lastShipped() {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "America/Chicago",
    }).format(new Date(__BUILD_TIME__));
  } catch {
    return "recently";
  }
}
