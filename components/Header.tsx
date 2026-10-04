import Link from "next/link";
import { site, telHref } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap text-base font-black uppercase tracking-tight sm:text-lg">
          <span aria-hidden className="inline-block h-6 w-6 rotate-45 rounded-sm bg-yellow-400" />
          {site.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-300 md:flex">
          <Link href="/guides" className="hover:text-yellow-400">Injury Guides</Link>
          <Link href="/videos" className="hover:text-yellow-400">Videos</Link>
          <Link href="/how-it-works" className="hover:text-yellow-400">How It Works</Link>
        </nav>
        <div className="flex items-center gap-2">
          {site.phone && (
            <a href={telHref(site.phone)} className="hidden rounded-lg border border-white/30 px-3 py-2 text-sm font-bold sm:inline-block hover:border-yellow-400">
              Call {site.phone}
            </a>
          )}
          <Link href="/free-case-review" className="whitespace-nowrap rounded-lg bg-yellow-400 px-3 py-2 text-sm font-black uppercase tracking-wide text-slate-950 hover:bg-yellow-300">
            <span className="sm:hidden">Free Review</span>
            <span className="hidden sm:inline">Free Case Review</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
