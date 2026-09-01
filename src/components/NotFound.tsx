import { Link } from "@/components/ui/Link";

export function NotFound() {
  return (
    <div className="wrap flex min-h-[70vh] flex-col justify-center py-20">
      <p className="eyebrow">404</p>
      <h1 className="display-xl mt-5 max-w-[14ch]">Nothing at this address.</h1>
      <p className="lede mt-6 max-w-[48ch]">
        Either the page moved, or it never existed. The work, writing, and contact details are all
        one click away.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Back home
        </Link>
        <Link href="/work" className="btn btn-ghost">
          See the work
        </Link>
      </div>
    </div>
  );
}
