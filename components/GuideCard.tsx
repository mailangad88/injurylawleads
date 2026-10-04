import Link from "next/link";
import { getCategory } from "@/lib/categories";
import type { GuideMeta } from "@/lib/content";

export function GuideCard({ guide }: { guide: GuideMeta }) {
  return (
    <Link href={guide.href} className="group block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">{getCategory(guide.category)?.name}</p>
      <h3 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-blue-900">{guide.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{guide.description}</p>
      <p className="mt-3 text-xs text-slate-500">{guide.readingMinutes} min read</p>
    </Link>
  );
}
