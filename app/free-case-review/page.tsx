import type { Metadata } from "next";
import { CaseReviewForm } from "@/components/CaseReviewForm";
import { categories } from "@/lib/categories";
import { site, telHref } from "@/lib/site";
import { stateCodes } from "@/lib/states";

export const metadata: Metadata = {
  title: "Free Case Review",
  description: "Answer a few questions to see if you may have a personal injury case. Free, fast and no obligation.",
  alternates: { canonical: "/free-case-review" },
};

// Ad landing page. Prefill with ?type=car-accidents&state=TX from your campaigns.
export default async function FreeCaseReview(props: PageProps<"/free-case-review">) {
  const sp = await props.searchParams;
  const type = typeof sp.type === "string" && categories.some((c) => c.slug === sp.type) ? sp.type : "";
  const state = typeof sp.state === "string" && stateCodes.includes(sp.state.toUpperCase()) ? sp.state.toUpperCase() : "";
  return (
    <div className="bg-slate-50">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1fr_440px]">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900">Get your free case review</h1>
          <p className="mt-4 text-lg text-slate-600">
            Tell us what happened. Our team will call you {site.callbackPromise} and, if your situation fits, connect you
            with a participating injury lawyer for a free consultation.
          </p>
          <ul className="mt-6 space-y-3 text-slate-700">
            <li><strong>No cost to you.</strong> Our service is free, and most injury lawyers charge nothing unless they recover money for you.</li>
            <li><strong>No obligation.</strong> You decide whether to move forward.</li>
            <li><strong>Private.</strong> We only share your information with participating firms to evaluate your claim.</li>
          </ul>
          {site.phone && (
            <p className="mt-8 text-slate-700">
              Prefer to talk now? Call <a href={telHref(site.phone)} className="font-bold text-slate-950 underline">{site.phone}</a>.
            </p>
          )}
        </div>
        <CaseReviewForm defaultIncidentType={type} defaultState={state} />
      </div>
    </div>
  );
}
