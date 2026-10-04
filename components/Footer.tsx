import Link from "next/link";
import { categories } from "@/lib/categories";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50 pb-24 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-extrabold text-slate-950">{site.name}</p>
          <p className="mt-2 max-w-md text-sm text-slate-600">{site.tagline}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Injury guides</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {categories.map((c) => (
              <li key={c.slug}><Link href={`/guides/${c.slug}`} className="hover:text-blue-800">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/how-it-works" className="hover:text-blue-800">How it works</Link></li>
            <li><Link href="/partners" className="hover:text-blue-800">Participating law firms</Link></li>
            <li><Link href="/disclaimer" className="hover:text-blue-800">Disclaimer</Link></li>
            <li><Link href="/privacy" className="hover:text-blue-800">Privacy policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue-800">Terms of use</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-slate-500">
          ATTORNEY ADVERTISING. {site.name} is operated by {site.legalEntity}, which is not a law firm and does not
          provide legal advice. We are a marketing service that connects people with independent participating
          attorneys. Submitting a form or calling does not create an attorney-client relationship. Information on this
          site is general and may not apply to your situation. Prior results do not guarantee a similar outcome. See our{" "}
          <Link href="/disclaimer" className="underline">full disclaimer</Link>. © {new Date().getFullYear()} {site.legalEntity}.
        </p>
      </div>
    </footer>
  );
}
