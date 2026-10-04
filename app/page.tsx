import Link from "next/link";
import { CaseReviewForm } from "@/components/CaseReviewForm";
import { ExplainerVideo } from "@/components/ExplainerVideo";
import { GuideCard } from "@/components/GuideCard";
import { categories } from "@/lib/categories";
import { getAllGuides } from "@/lib/content";
import { site } from "@/lib/site";

const steps = [
  { title: "Tell us what happened", body: "Answer a few quick questions online. It takes about a minute." },
  { title: "Get a call back fast", body: `Our intake team calls you ${site.callbackPromise} to learn more about your situation.` },
  { title: "Talk to a lawyer for free", body: "If your situation fits, we connect you with a participating injury lawyer for a free consultation." },
];

const reasons = [
  { title: "Free to you", body: "Our service costs you nothing. Most injury lawyers work on contingency, so there is no upfront fee." },
  { title: "Deadlines are real", body: "Every state limits how long you have to file. Waiting can cost you the right to recover anything." },
  { title: "Insurers have lawyers", body: "The other side's insurance company has adjusters and attorneys working to pay as little as possible." },
  { title: "No pressure", body: "Getting information does not commit you to anything. You decide whether to hire a lawyer." },
];

export default function Home() {
  const featured = getAllGuides().filter((g) => g.featured).slice(0, 6);
  return (
    <>
      <section className="bg-gradient-to-b from-blue-950 to-blue-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">Injured in an accident?</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
              Find out what your injury claim may be worth, for free.
            </h1>
            <p className="mt-5 text-lg text-blue-100">
              Answer a few questions and get connected with a participating personal injury lawyer. No upfront cost, and
              no fee unless they win your case.
            </p>
            <ul className="mt-6 space-y-2 text-blue-50">
              <li>✓ Car, truck and motorcycle accidents</li>
              <li>✓ Slip and falls, dog bites and workplace injuries</li>
              <li>✓ Medical malpractice and wrongful death</li>
            </ul>
          </div>
          <div id="review">
            <CaseReviewForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-slate-200 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 font-bold text-slate-900">{i + 1}</div>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Why talk to a lawyer now?</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {reasons.map((r) => (
                <div key={r.title}>
                  <h3 className="font-bold text-blue-900">{r.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
          <ExplainerVideo slug="after-a-car-accident" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900">What kind of injury?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.slug} href={`/guides/${c.slug}`} className="rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md">
              <h3 className="font-bold text-blue-900">{c.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-8">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-slate-900">Popular guides</h2>
            <Link href="/guides" className="text-sm font-semibold text-blue-800">All guides →</Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((g) => <GuideCard key={g.href} guide={g} />)}
          </div>
        </section>
      )}
    </>
  );
}
