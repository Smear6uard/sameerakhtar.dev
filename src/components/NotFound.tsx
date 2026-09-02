import { Link } from "@/components/ui/Link";

export function NotFound() {
  return (
    <div className="wrap relative z-10 flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <pre className="font-mono text-xs leading-tight text-accent/50 sm:text-sm" aria-hidden="true">
        {`
   _  _    ___  _  _
  | || |  / _ \\| || |
  | || |_| | | | || |_
  |__   _| | | |__   _|
     | | | |_| |  | |
     |_|  \\___/   |_|
`}
      </pre>
      <h1 className="display-lg mt-6">This page doesn&apos;t exist</h1>
      <p className="lede mt-4 max-w-[44ch]">
        Either I haven&apos;t built it yet, or you&apos;re testing my 404 page. The work, writing,
        and contact details are one click away.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          ← Back home
        </Link>
        <Link href="/work" className="btn btn-ghost">
          See the work
        </Link>
      </div>
    </div>
  );
}
