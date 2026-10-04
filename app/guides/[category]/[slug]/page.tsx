import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { CaseReviewForm } from "@/components/CaseReviewForm";
import { GuideCard } from "@/components/GuideCard";
import { JsonLd } from "@/components/JsonLd";
import { mdxComponents, CaseReviewCTA } from "@/components/mdx";
import { getCategory } from "@/lib/categories";
import { getAllGuides, getGuide, getRelatedGuides } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ category: g.category, slug: g.slug }));
}

export async function generateMetadata(props: PageProps<"/guides/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await props.params;
  const g = getGuide(category, slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: g.href },
    openGraph: { type: "article", title: g.title, description: g.description, modifiedTime: g.updated.toISOString() },
  };
}

export default async function GuidePage(props: PageProps<"/guides/[category]/[slug]">) {
  const { category, slug } = await props.params;
  const guide = getGuide(category, slug);
  const cat = getCategory(category);
  if (!guide || !cat) notFound();

  const { content } = await compileMDX({ source: guide.body, components: mdxComponents });
  const related = getRelatedGuides(guide);
  const url = `${site.url}${guide.href}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: guide.title,
              description: guide.description,
              dateModified: guide.updated.toISOString(),
              author: { "@type": "Organization", name: guide.author },
              publisher: { "@type": "Organization", name: site.name },
              mainEntityOfPage: url,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Guides", item: `${site.url}/guides` },
                { "@type": "ListItem", position: 2, name: cat.name, item: `${site.url}/guides/${cat.slug}` },
                { "@type": "ListItem", position: 3, name: guide.title, item: url },
              ],
            },
            ...(guide.faqs.length
              ? [{
                  "@type": "FAQPage",
                  mainEntity: guide.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
                }]
              : []),
          ],
        }}
      />
      <nav className="text-sm text-slate-500">
        <Link href="/guides" className="hover:text-blue-800">Guides</Link> /{" "}
        <Link href={`/guides/${cat.slug}`} className="hover:text-blue-800">{cat.name}</Link>
      </nav>
      <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_380px]">
        <article>
          <h1 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">{guide.title}</h1>
          <p className="mt-3 text-sm text-slate-500">
            Updated {guide.updated.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}
            {" · "}{guide.readingMinutes} min read{" · "}By {guide.author}
            {guide.reviewedBy && <> · Reviewed by {guide.reviewedBy}</>}
          </p>
          <div className="prose prose-slate mt-6 max-w-none prose-headings:text-slate-900 prose-a:text-blue-800">
            {content}
          </div>
          {guide.faqs.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
              <div className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200">
                {guide.faqs.map((f) => (
                  <details key={f.q} className="group p-5">
                    <summary className="cursor-pointer font-semibold text-slate-900">{f.q}</summary>
                    <p className="mt-2 text-slate-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
          <CaseReviewCTA />
          <p className="text-xs text-slate-500">
            This guide is general information, not legal advice, and laws vary by state. For advice about your situation,
            talk to a licensed attorney in your state.
          </p>
        </article>
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <CaseReviewForm defaultIncidentType={cat.slug} compact />
        </aside>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900">Keep reading</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((g) => <GuideCard key={g.href} guide={g} />)}
          </div>
        </section>
      )}
    </div>
  );
}
