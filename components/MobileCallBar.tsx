import Link from "next/link";
import { site, telHref } from "@/lib/site";

// Sticky bottom bar on phones, where most injury searches happen.
export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-slate-200 bg-white p-3 md:hidden">
      {site.phone && (
        <a href={telHref(site.phone)} className="flex-1 rounded-lg border border-slate-950 py-3 text-center font-semibold text-slate-950">
          Call now
        </a>
      )}
      <Link href="/free-case-review" className="flex-1 rounded-lg bg-yellow-400 py-3 text-center font-bold text-slate-900">
        Free case review
      </Link>
    </div>
  );
}
