import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/GuideCard";
import { categories } from "@/lib/categories";
import { getGuidesByCategory } from "@/lib/content";

export const metadata: Metadata = {
  title: "Personal Injury Guides",
  description: "Plain-English guides to car accidents, slip and falls, medical malpractice, insurance claims and more.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-extrabold text-slate-900">Personal injury guides</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-600">
        Clear answers to the questions people ask after an accident, written so you can make informed decisions.
      </p>
      {categories.map((c) => {
        const guides = getGuidesByCategory(c.slug);
        if (!guides.length) return null;
        return (
          <section key={c.slug} className="mt-12">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold text-slate-900">{c.name}</h2>
              <Link href={`/guides/${c.slug}`} className="text-sm font-semibold text-blue-800">View all →</Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {guides.slice(0, 3).map((g) => <GuideCard key={g.href} guide={g} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
