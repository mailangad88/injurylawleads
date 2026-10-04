import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseReviewForm } from "@/components/CaseReviewForm";
import { GuideCard } from "@/components/GuideCard";
import { JsonLd } from "@/components/JsonLd";
import { categories, getCategory } from "@/lib/categories";
import { getGuidesByCategory } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: PageProps<"/guides/[category]">): Promise<Metadata> {
  const { category } = await props.params;
  const c = getCategory(category);
  if (!c) return {};
  return { title: `${c.name} Guides`, description: c.description, alternates: { canonical: `/guides/${c.slug}` } };
}

export default async function CategoryPage(props: PageProps<"/guides/[category]">) {
  const { category } = await props.params;
  const c = getCategory(category);
  if (!c) notFound();
  const guides = getGuidesByCategory(c.slug);
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_380px]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Guides", item: `${site.url}/guides` },
            { "@type": "ListItem", position: 2, name: c.name, item: `${site.url}/guides/${c.slug}` },
          ],
        }}
      />
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900">{c.name}</h1>
        <p className="mt-3 text-lg text-slate-600">{c.description}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {guides.map((g) => <GuideCard key={g.href} guide={g} />)}
        </div>
        {!guides.length && <p className="mt-8 text-slate-500">Guides for this topic are coming soon.</p>}
      </div>
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <CaseReviewForm defaultIncidentType={c.slug} compact />
      </aside>
    </div>
  );
}
