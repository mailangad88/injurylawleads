import type { LeadInput } from "./schema";

// A simple first-pass priority so the fastest callbacks go to the strongest cases.
// Tune this with your intake team once you see which leads actually sign.
export function scoreLead(lead: LeadInput): "hot" | "warm" | "cold" {
  if (lead.hasAttorney === "yes") return "cold";
  if (lead.incidentWhen === "older") return "cold";
  const recent = ["7d", "30d", "6m"].includes(lead.incidentWhen);
  const treated = lead.medicalTreatment === "yes";
  const serious = ["truck-accidents", "wrongful-death", "medical-malpractice"].includes(lead.incidentType);
  if ((recent && treated) || serious) return "hot";
  return "warm";
}
