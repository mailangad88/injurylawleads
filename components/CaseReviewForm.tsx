import { consentText } from "@/lib/leads/consent";
import { LeadForm } from "./LeadForm";

// Server wrapper so the consent wording is always the versioned copy from lib/leads/consent.ts.
export function CaseReviewForm(props: { defaultIncidentType?: string; defaultState?: string; heading?: string; compact?: boolean }) {
  return <LeadForm consentText={consentText()} {...props} />;
}
