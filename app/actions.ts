"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { consentHash, CONSENT_VERSION } from "@/lib/leads/consent";
import { notifyNewLead } from "@/lib/leads/notify";
import { rateLimited } from "@/lib/leads/rate-limit";
import { leadSchema, type Lead } from "@/lib/leads/schema";
import { scoreLead } from "@/lib/leads/score";
import { saveLead } from "@/lib/leads/store";

export type LeadFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];

function str(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v : "";
}

export async function submitLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  // Bots fill the hidden "company" field or submit faster than a person can type.
  const startedAt = Number(str(formData.get("startedAt")));
  if (str(formData.get("company")) || (startedAt && Date.now() - startedAt < 2500)) {
    redirect("/thank-you");
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
  if (ip && rateLimited(ip)) {
    return { status: "error", message: "Too many submissions. Please wait a few minutes or give us a call." };
  }

  const parsed = leadSchema.safeParse({
    incidentType: str(formData.get("incidentType")),
    state: str(formData.get("state")),
    incidentWhen: str(formData.get("incidentWhen")),
    medicalTreatment: str(formData.get("medicalTreatment")),
    hasAttorney: str(formData.get("hasAttorney")),
    firstName: str(formData.get("firstName")),
    lastName: str(formData.get("lastName")),
    phone: str(formData.get("phone")),
    email: str(formData.get("email")),
    description: str(formData.get("description")),
    consent: str(formData.get("consent")),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const v = str(formData.get(key));
    if (v) utm[key] = v.slice(0, 200);
  }

  const lead: Lead = {
    ...parsed.data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    priority: scoreLead(parsed.data),
    consentVersion: CONSENT_VERSION,
    consentHash: consentHash(),
    tracking: {
      ip,
      userAgent: h.get("user-agent"),
      pageUrl: str(formData.get("pageUrl")).slice(0, 500) || null,
      referrer: str(formData.get("referrer")).slice(0, 500) || null,
      utm,
    },
  };

  const [stored, alerts] = await Promise.all([saveLead(lead), notifyNewLead(lead)]);
  const alerted = Object.values(alerts).includes("sent");

  if (!stored.ok) console.error(`[lead ${lead.id}] store "${stored.store}" failed: ${stored.error}`);
  for (const [channel, result] of Object.entries(alerts)) {
    if (result.startsWith("failed")) console.error(`[lead ${lead.id}] ${channel} alert ${result}`);
  }

  // Only tell the person we have their request if it actually landed somewhere.
  if (!stored.ok && !alerted) {
    return {
      status: "error",
      message: "Sorry, something went wrong on our side and your request was not sent. Please try again or call us.",
    };
  }

  redirect(`/thank-you?p=${lead.priority === "cold" ? "c" : "w"}`);
}
