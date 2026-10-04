"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitLead, type LeadFormState } from "@/app/actions";
import { categories } from "@/lib/categories";
import { treatmentOptions, whenOptions } from "@/lib/leads/schema";
import { states } from "@/lib/states";

const TRACK_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];
const STEP1_FIELDS = ["incidentType", "state", "incidentWhen", "medicalTreatment", "hasAttorney"];

type Props = {
  consentText: string;
  defaultIncidentType?: string;
  defaultState?: string;
  heading?: string;
  compact?: boolean;
};

function readTracking() {
  // First-touch attribution: keep the landing page and UTM tags for the whole visit.
  try {
    const stored = sessionStorage.getItem("ilg_track");
    if (stored) return JSON.parse(stored) as Record<string, string>;
    const params = new URLSearchParams(window.location.search);
    const t: Record<string, string> = { landingUrl: window.location.href, referrer: document.referrer };
    for (const k of TRACK_KEYS) {
      const v = params.get(k);
      if (v) t[k] = v;
    }
    sessionStorage.setItem("ilg_track", JSON.stringify(t));
    return t;
  } catch {
    return {} as Record<string, string>;
  }
}

export function LeadForm({ consentText, defaultIncidentType = "", defaultState = "", heading, compact }: Props) {
  const [state, action, pending] = useActionState<LeadFormState, FormData>(submitLead, { status: "idle" });
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState("");
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [startedAt, setStartedAt] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    setTracking(readTracking());
    setStartedAt(String(Date.now()));
  }, []);

  // If the server rejects a step-one answer, take the person back to fix it.
  useEffect(() => {
    if (STEP1_FIELDS.some((f) => errors[f])) setStep(1);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  function next() {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const missing = STEP1_FIELDS.some((f) => !data.get(f));
    if (missing) {
      setStepError("Please answer each question so we can match you with the right lawyer.");
      return;
    }
    setStepError("");
    setStep(2);
  }

  const field = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20";
  const lbl = "mb-1 block text-sm font-medium text-slate-800";
  const err = (name: string) => errors[name] && <p className="mt-1 text-sm text-red-700">{errors[name]}</p>;

  return (
    <form
      ref={formRef}
      action={action}
      className={`rounded-2xl border border-slate-200 bg-white shadow-lg ${compact ? "p-5" : "p-6 md:p-8"}`}
      noValidate={step === 1}
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Free case review · Step {step} of 2</p>
        <h2 className={`${compact ? "text-xl" : "text-2xl"} mt-1 font-bold text-slate-900`}>
          {heading ?? (step === 1 ? "See if you may have a case" : "Where can we reach you?")}
        </h2>
        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
          <div className="h-1.5 rounded-full bg-amber-500 transition-all" style={{ width: step === 1 ? "50%" : "100%" }} />
        </div>
      </div>

      {/* Hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>Company<input type="text" name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />
      <input type="hidden" name="pageUrl" value={tracking.landingUrl ?? ""} />
      <input type="hidden" name="referrer" value={tracking.referrer ?? ""} />
      {TRACK_KEYS.map((k) => (
        <input key={k} type="hidden" name={k} value={tracking[k] ?? ""} />
      ))}

      <div hidden={step !== 1} className="space-y-4">
        <div>
          <label className={lbl} htmlFor="incidentType">What happened?</label>
          <select id="incidentType" name="incidentType" defaultValue={defaultIncidentType} className={field}>
            <option value="" disabled>Choose one</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.short}</option>
            ))}
          </select>
          {err("incidentType")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={lbl} htmlFor="state">State where it happened</label>
            <select id="state" name="state" defaultValue={defaultState} className={field}>
              <option value="" disabled>Choose state</option>
              {states.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
            {err("state")}
          </div>
          <div>
            <label className={lbl} htmlFor="incidentWhen">When did it happen?</label>
            <select id="incidentWhen" name="incidentWhen" defaultValue="" className={field}>
              <option value="" disabled>Choose one</option>
              {whenOptions.map((w) => (
                <option key={w.value} value={w.value}>{w.label}</option>
              ))}
            </select>
            {err("incidentWhen")}
          </div>
        </div>
        <fieldset>
          <legend className={lbl}>Did you see a doctor or go to the ER?</legend>
          <div className="flex flex-wrap gap-2">
            {treatmentOptions.map((o) => (
              <label key={o.value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 has-[:checked]:border-blue-700 has-[:checked]:bg-blue-50">
                <input type="radio" name="medicalTreatment" value={o.value} className="accent-blue-700" /> {o.label}
              </label>
            ))}
          </div>
          {err("medicalTreatment")}
        </fieldset>
        <fieldset>
          <legend className={lbl}>Do you already have a lawyer for this?</legend>
          <div className="flex gap-2">
            {["no", "yes"].map((v) => (
              <label key={v} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 capitalize has-[:checked]:border-blue-700 has-[:checked]:bg-blue-50">
                <input type="radio" name="hasAttorney" value={v} className="accent-blue-700" /> {v}
              </label>
            ))}
          </div>
          {err("hasAttorney")}
        </fieldset>
        {stepError && <p className="text-sm text-red-700">{stepError}</p>}
        <button type="button" onClick={next} className="w-full rounded-lg bg-amber-500 px-5 py-3.5 text-lg font-bold text-slate-900 shadow hover:bg-amber-400">
          Continue
        </button>
        <p className="text-center text-xs text-slate-500">Takes about 60 seconds. No cost, no obligation.</p>
      </div>

      <div hidden={step !== 2} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={lbl} htmlFor="firstName">First name</label>
            <input id="firstName" name="firstName" autoComplete="given-name" required={step === 2} className={field} />
            {err("firstName")}
          </div>
          <div>
            <label className={lbl} htmlFor="lastName">Last name</label>
            <input id="lastName" name="lastName" autoComplete="family-name" required={step === 2} className={field} />
            {err("lastName")}
          </div>
        </div>
        <div>
          <label className={lbl} htmlFor="phone">Mobile phone</label>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required={step === 2} className={field} placeholder="(555) 555-5555" />
          {err("phone")}
        </div>
        <div>
          <label className={lbl} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required={step === 2} className={field} />
          {err("email")}
        </div>
        <div>
          <label className={lbl} htmlFor="description">Briefly, what happened? <span className="font-normal text-slate-500">(optional)</span></label>
          <textarea id="description" name="description" rows={compact ? 2 : 3} maxLength={1500} className={field} />
        </div>
        <label className="flex gap-3 text-xs leading-relaxed text-slate-600">
          <input type="checkbox" name="consent" required={step === 2} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-700" />
          <span>
            {consentText}{" "}
            <Link href="/terms" className="underline">Terms</Link> · <Link href="/privacy" className="underline">Privacy</Link> ·{" "}
            <Link href="/partners" className="underline">Partners</Link>
          </span>
        </label>
        {err("consent")}
        {state.status === "error" && state.message && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{state.message}</p>
        )}
        <button type="submit" disabled={pending} className="w-full rounded-lg bg-amber-500 px-5 py-3.5 text-lg font-bold text-slate-900 shadow hover:bg-amber-400 disabled:opacity-60">
          {pending ? "Sending..." : "Get my free case review"}
        </button>
        <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-slate-500 underline">
          Back
        </button>
      </div>
    </form>
  );
}
