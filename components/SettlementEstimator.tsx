"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories } from "@/lib/categories";
import {
  contributoryNegligenceStates,
  estimate,
  faultOptions,
  noEstimateTypes,
  severities,
  usd,
  type EstimateInput,
} from "@/lib/estimator";
import { states } from "@/lib/states";
import { LeadForm } from "./LeadForm";

function parseMoney(v: string) {
  const n = Number(v.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function MoneyInput({ id, label, hint, value, onChange }: { id: string; label: string; hint: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-slate-900">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
        <input
          id={id}
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d,]/g, ""))}
          placeholder="0"
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-7 pr-3 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

export function SettlementEstimator({ consentText }: { consentText: string }) {
  const [incidentType, setIncidentType] = useState("car-accidents");
  const [state, setState] = useState("");
  const [severity, setSeverity] = useState<EstimateInput["severity"]>("moderate");
  const [medical, setMedical] = useState("");
  const [future, setFuture] = useState("");
  const [wages, setWages] = useState("");
  const [fault, setFault] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const result = useMemo(
    () => estimate({ severity, medicalBills: parseMoney(medical), futureMedical: parseMoney(future), lostWages: parseMoney(wages), faultPercent: fault }),
    [severity, medical, future, wages, fault],
  );

  const noNumber = noEstimateTypes.includes(incidentType);
  const hasInputs = result.economic > 0;
  const contributory = state && contributoryNegligenceStates.includes(state) && fault > 0;
  const sev = severities.find((s) => s.value === severity)!;
  const typeName = categories.find((c) => c.slug === incidentType)?.short ?? "";

  const context = noNumber
    ? `Estimator: ${typeName}, no number shown`
    : `Estimator: ${typeName}, ${sev.label.toLowerCase()} injury, medical ${usd(parseMoney(medical))}, future medical ${usd(parseMoney(future))}, lost wages ${usd(parseMoney(wages))}, fault ${fault}%, illustrative range ${usd(result.low)} to ${usd(result.high)}`;

  const field = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-400/50";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="est-type" className="mb-1 block text-sm font-semibold text-slate-900">What happened?</label>
            <select id="est-type" value={incidentType} onChange={(e) => setIncidentType(e.target.value)} className={field}>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.short}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="est-state" className="mb-1 block text-sm font-semibold text-slate-900">State where it happened</label>
            <select id="est-state" value={state} onChange={(e) => setState(e.target.value)} className={field}>
              <option value="">Choose state</option>
              {states.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {noNumber ? (
          <div className="rounded-xl bg-slate-50 p-5 text-slate-700">
            <p className="font-semibold text-slate-900">These cases are too individual for a calculator.</p>
            <p className="mt-1 text-sm">
              {incidentType === "wrongful-death"
                ? "Wrongful death claims depend on the person's age, income, family and your state's law. A lawyer can explain what your family may be able to recover."
                : "Medical malpractice claims depend on expert review, and many states cap certain damages. A lawyer can tell you whether your situation may have a claim."}
            </p>
          </div>
        ) : (
          <>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-slate-900">How serious is the injury?</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {severities.map((s) => (
                  <label key={s.value} className="flex cursor-pointer gap-3 rounded-xl border border-slate-300 p-3 has-[:checked]:border-slate-950 has-[:checked]:bg-yellow-50">
                    <input type="radio" name="severity" value={s.value} checked={severity === s.value} onChange={() => setSeverity(s.value)} className="mt-1 accent-slate-950" />
                    <span>
                      <span className="block font-semibold text-slate-900">{s.label}</span>
                      <span className="block text-xs text-slate-600">{s.detail}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-3">
              <MoneyInput id="est-med" label="Medical bills so far" hint="ER, doctors, therapy, prescriptions" value={medical} onChange={setMedical} />
              <MoneyInput id="est-future" label="Future medical costs" hint="If a doctor expects more care" value={future} onChange={setFuture} />
              <MoneyInput id="est-wages" label="Lost wages" hint="Pay you missed because of the injury" value={wages} onChange={setWages} />
            </div>

            <div>
              <label htmlFor="est-fault" className="mb-1 block text-sm font-semibold text-slate-900">Were you partly at fault?</label>
              <select id="est-fault" value={fault} onChange={(e) => setFault(Number(e.target.value))} className={field}>
                {faultOptions.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </>
        )}
      </div>

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="overflow-hidden rounded-2xl bg-slate-950 text-white shadow-lg">
          <div className="p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">Illustrative range</p>
            {noNumber ? (
              <p className="mt-3 text-2xl font-black">Talk to a lawyer for a real answer</p>
            ) : hasInputs ? (
              <>
                <p className="mt-3 text-3xl font-black leading-tight sm:text-4xl" aria-live="polite">
                  {usd(result.low)} <span className="text-slate-400">to</span> {usd(result.high)}
                </p>
                <dl className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between gap-4"><dt className="text-slate-300">Medical bills and lost wages</dt><dd className="font-semibold">{usd(result.economic)}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-slate-300">Pain and suffering ({result.multiplierLow}x to {result.multiplierHigh}x medical)</dt><dd className="whitespace-nowrap font-semibold">{usd(result.painLow)} to {usd(result.painHigh)}</dd></div>
                  {fault > 0 && (
                    <div className="flex justify-between gap-4"><dt className="text-slate-300">Reduced for your share of fault</dt><dd className="font-semibold">minus {fault}%</dd></div>
                  )}
                </dl>
              </>
            ) : (
              <p className="mt-3 text-lg text-slate-300">Enter your medical bills and lost wages to see a range.</p>
            )}

            {contributory && (
              <p className="mt-4 rounded-lg bg-red-500/15 p-3 text-sm text-red-100">
                {states.find((s) => s.code === state)?.name} uses contributory negligence, which can bar recovery if you were even slightly at fault. Exceptions exist, so ask a lawyer.
              </p>
            )}
            {fault >= 50 && !contributory && (
              <p className="mt-4 rounded-lg bg-yellow-400/15 p-3 text-sm text-yellow-100">
                Many states bar recovery if you were 50% or 51% or more at fault. A lawyer can tell you which rule applies to you.
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="animate-glow mt-6 w-full rounded-xl bg-yellow-400 px-5 py-4 text-lg font-black uppercase tracking-wide text-slate-950 hover:bg-yellow-300"
            >
              Get a free case review
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">A participating lawyer can review your actual claim, free.</p>
          </div>
          <div className="border-t border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-slate-400">
            This is an educational illustration based only on the numbers you entered and a common rule of thumb. It is
            not a prediction, an offer or legal advice. Real outcomes depend on the facts, the evidence, insurance policy
            limits, your state&apos;s laws, liens and attorney fees, and many cases recover less or nothing.
          </div>
        </div>

        {showForm && (
          <div className="mt-6" id="estimator-review">
            <LeadForm
              key={`${incidentType}-${state}`}
              consentText={consentText}
              defaultIncidentType={incidentType}
              defaultState={state}
              heading="Get your free case review"
              context={context}
              compact
            />
          </div>
        )}
        <p className="mt-4 text-center text-sm text-slate-600">
          How is this calculated? <Link href="#how-it-works" className="font-semibold text-slate-950 underline decoration-yellow-400 decoration-2">See the method</Link>
        </p>
      </aside>
    </div>
  );
}
