import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SettlementEstimator } from "@/components/SettlementEstimator";
import { consentText } from "@/lib/leads/consent";
import { severities } from "@/lib/estimator";

export const metadata: Metadata = {
  title: "Injury Settlement Calculator",
  description: "See an illustrative settlement range for a car accident or other injury, based on your medical bills, lost wages, injury severity and fault.",
  alternates: { canonical: "/settlement-calculator" },
};

const faqs = [
  {
    q: "How accurate is an injury settlement calculator?",
    a: "Not very, and no calculator can be. It shows how insurers often think about a claim, using only the numbers you enter. The real value depends on evidence, insurance limits, your state's laws and the details of your injuries.",
  },
  {
    q: "What is the multiplier method?",
    a: "A rule of thumb where pain and suffering is estimated as medical costs times a number, often between 1.5 and 5 depending on how serious and lasting the injury is. That amount is added to medical bills and lost wages.",
  },
  {
    q: "Why might I receive less than the estimate?",
    a: "The at-fault driver's insurance limit may be lower than your losses. Health insurers and hospitals may have liens to repay, attorney fees and case costs come out of a recovery, and disputes over fault or treatment can reduce an offer.",
  },
];

export default function SettlementCalculatorPage() {
  return (
    <div className="bg-slate-50">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-400">Free calculator</p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-tight tracking-tight md:text-5xl">
            What could your injury claim be worth?
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Enter your medical bills, lost wages and how serious the injury is. You&apos;ll see an illustrative range
            based on a method insurers often use, then you can have a lawyer review your actual claim for free.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <SettlementEstimator consentText={consentText()} />

        <section id="how-it-works" className="mt-16 max-w-3xl scroll-mt-24">
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950">How the estimate works</h2>
          <div className="prose prose-slate mt-4 max-w-none">
            <p>The calculator uses the multiplier method, a rule of thumb many insurance adjusters start from:</p>
            <ol>
              <li><strong>Economic losses</strong> = medical bills so far + expected future medical costs + lost wages.</li>
              <li><strong>Pain and suffering</strong> = medical costs × a multiplier based on severity.</li>
              <li><strong>Total</strong> = economic losses + pain and suffering, reduced by your share of fault.</li>
            </ol>
            <table>
              <thead><tr><th>Severity</th><th>Example</th><th>Multiplier used</th></tr></thead>
              <tbody>
                {severities.map((s) => (
                  <tr key={s.value}><td>{s.label}</td><td>{s.detail}</td><td>{s.low} to {s.high}</td></tr>
                ))}
              </tbody>
            </table>
            <p>
              The result is rounded so it doesn&apos;t look more precise than it is. It leaves out property damage,
              punitive damages and state damage caps, and it can&apos;t account for insurance policy limits, which often
              decide what is actually paid. Wrongful death and medical malpractice claims are too individual for this
              method, so the calculator shows no number for them.
            </p>
            <p>
              For more on what drives a claim&apos;s value, read{" "}
              <Link href="/guides/car-accidents/how-much-is-my-car-accident-case-worth">How much is my car accident case worth?</Link>
            </p>
          </div>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950">Frequently asked questions</h2>
          <div className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {faqs.map((f) => (
              <details key={f.q} className="p-5">
                <summary className="cursor-pointer font-semibold text-slate-900">{f.q}</summary>
                <p className="mt-2 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
