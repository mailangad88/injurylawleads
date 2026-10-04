import Link from "next/link";
import { CaseReviewForm } from "@/components/CaseReviewForm";
import { ExplainerVideo } from "@/components/ExplainerVideo";
import { GuideCard } from "@/components/GuideCard";
import { Reveal } from "@/components/Reveal";
import { categories } from "@/lib/categories";
import { getAllGuides } from "@/lib/content";
import { site } from "@/lib/site";

const promises = [
  "Free case review",
  "No upfront cost",
  `Call back ${site.callbackPromise}`,
  "No obligation",
];

const steps = [
  { title: "Tell us what happened", body: "Answer five quick questions online. It takes about a minute." },
  { title: "Get a call back fast", body: `Our intake team calls you ${site.callbackPromise} to get the details.` },
  { title: "Talk to a lawyer for free", body: "If your case fits, we connect you with a participating injury lawyer licensed in your state." },
];

const reasons = [
  { title: "The insurer already has a team", body: "Adjusters and defense lawyers start working on the claim right away. A lawyer puts someone on your side too." },
  { title: "Deadlines are strict", body: "Every state limits how long you have to file. Claims against cities and agencies can have notice deadlines of a few months." },
  { title: "Most lawyers charge nothing up front", body: "Injury lawyers usually work on contingency, so their fee comes out of a recovery and you pay nothing to start." },
  { title: "Early offers are usually low", body: "Signing a release ends your claim, even if you later need surgery. Talk to a lawyer before you sign anything." },
];

export default function Home() {
  const featured = getAllGuides().filter((g) => g.featured).slice(0, 6);
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-yellow-400/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-32 h-[28rem] w-[28rem] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center">
            <p className="animate-rise text-sm font-black uppercase tracking-[0.2em] text-yellow-400">Hurt in an accident?</p>
            <h1 className="animate-rise delay-1 mt-4 text-4xl font-black uppercase leading-[1.02] tracking-tight md:text-6xl">
              Get an injury lawyer <span className="text-yellow-400">on your side.</span>
            </h1>
            <p className="animate-rise delay-2 mt-6 max-w-xl text-lg text-slate-300">
              The insurance company has a team working its side of your claim. Answer a few questions and we&apos;ll
              connect you with a participating personal injury lawyer for a free consultation.
            </p>
            <ul className="animate-rise delay-3 mt-8 grid grid-cols-2 gap-3 text-sm font-semibold">
              {promises.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-slate-950">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div id="review" className="animate-rise delay-2">
            <CaseReviewForm />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-yellow-400">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-4 text-sm font-black uppercase tracking-wide text-slate-950">
          {categories.slice(0, 8).map((c) => (
            <Link key={c.slug} href={`/guides/${c.slug}`} className="hover:underline">{c.name}</Link>
          ))}
        </div>
      </section>

      <Reveal className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-black uppercase tracking-tight text-slate-950 md:text-4xl">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="lift rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-5xl font-black text-yellow-400">0{i + 1}</div>
              <h3 className="mt-3 text-lg font-black text-slate-950">{s.title}</h3>
              <p className="mt-2 text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-col items-start gap-6 rounded-3xl border-2 border-yellow-400 bg-yellow-50 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">Free settlement calculator</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-slate-950 md:text-3xl">What could your claim be worth?</h2>
            <p className="mt-2 max-w-xl text-slate-700">Enter your medical bills, lost wages and how serious the injury is to see an illustrative range in under a minute.</p>
          </div>
          <Link href="/settlement-calculator" className="lift shrink-0 rounded-xl bg-slate-950 px-7 py-4 font-black uppercase tracking-wide text-white">
            Estimate my claim
          </Link>
        </div>
      </Reveal>

      <section className="bg-slate-950 text-white">
        <Reveal className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">Why call a lawyer <span className="text-yellow-400">now</span></h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {reasons.map((r) => (
                <div key={r.title} className="border-l-4 border-yellow-400 pl-4">
                  <h3 className="font-black">{r.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
          <ExplainerVideo slug="after-a-car-accident" />
        </Reveal>
      </section>

      <Reveal className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 md:text-4xl">What happened to you?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.slug} href={`/guides/${c.slug}`} className="lift group rounded-2xl border border-slate-200 p-5">
              <h3 className="flex items-center justify-between font-black text-slate-950">
                {c.name}
                <span aria-hidden className="text-yellow-500 transition group-hover:translate-x-1">→</span>
              </h3>
              <p className="mt-1 text-sm text-slate-600">{c.description}</p>
            </Link>
          ))}
        </div>
      </Reveal>

      {featured.length > 0 && (
        <Reveal className="mx-auto max-w-6xl px-4 pb-8">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 md:text-4xl">Popular guides</h2>
            <Link href="/guides" className="text-sm font-bold text-slate-950 underline decoration-yellow-400 decoration-2 underline-offset-4">All guides</Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((g) => <GuideCard key={g.href} guide={g} />)}
          </div>
        </Reveal>
      )}

      <section className="mx-auto mt-12 max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-center text-white md:px-12">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-400/25 blur-3xl" />
          <h2 className="relative text-3xl font-black uppercase tracking-tight md:text-4xl">Find out where you stand</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-slate-300">A free review takes about a minute, and you decide what happens next.</p>
          <Link href="/free-case-review" className="animate-glow relative mt-6 inline-block rounded-xl bg-yellow-400 px-8 py-4 text-lg font-black uppercase tracking-wide text-slate-950 hover:bg-yellow-300">
            Start my free case review
          </Link>
        </div>
      </section>
    </>
  );
}
