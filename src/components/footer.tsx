import { site } from "@/lib/site";

const FOOTER_LINKS = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
  { label: "Email", href: `mailto:${site.email}` },
  { label: "Site source", href: site.sourceRepo },
];

export function Footer() {
  return (
    <footer className="hairline mt-16">
      <div className="wrap flex flex-col gap-6 py-10 text-sm text-ink-3 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <p className="text-ink-2">© {new Date().getFullYear()} Sameer Akhtar</p>
          <p className="mt-1.5">
            Built with TanStack Start, React 19, and Tailwind v4. Set in Bricolage Grotesque,
            Satoshi, and JetBrains Mono. Colors sampled from my own photographs.
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
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
