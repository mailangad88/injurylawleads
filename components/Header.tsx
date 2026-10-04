import Link from "next/link";
import { site, telHref } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-blue-900">
          {site.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link href="/guides" className="hover:text-blue-800">Injury Guides</Link>
          <Link href="/videos" className="hover:text-blue-800">Videos</Link>
          <Link href="/how-it-works" className="hover:text-blue-800">How It Works</Link>
        </nav>
        <div className="flex items-center gap-2">
          {site.phone && (
            <a href={telHref(site.phone)} className="hidden rounded-lg border border-blue-900 px-3 py-2 text-sm font-semibold text-blue-900 sm:inline-block">
              Call {site.phone}
            </a>
          )}
          <Link href="/free-case-review" className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-bold text-slate-900 hover:bg-amber-400">
            Free Case Review
          </Link>
        </div>
      </div>
    </header>
  );
}
