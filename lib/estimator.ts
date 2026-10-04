// Illustrative settlement range using the "multiplier method": economic losses
// plus a pain-and-suffering amount of medical costs x a severity multiplier,
// reduced by the person's share of fault. It is a teaching tool, not a valuation.
// Every number comes from what the visitor enters; nothing here is a statistic.

export const severities = [
  { value: "minor", label: "Minor", detail: "Sprains, bruises, whiplash that heals in weeks", low: 1.5, high: 2 },
  { value: "moderate", label: "Moderate", detail: "Fractures, concussion, months of treatment", low: 2, high: 3 },
  { value: "serious", label: "Serious", detail: "Surgery, hospital stay, long recovery", low: 3, high: 4 },
  { value: "severe", label: "Severe or permanent", detail: "Lasting disability, scarring, brain or spine injury", low: 4, high: 5 },
] as const;

export const faultOptions = [
  { value: 0, label: "Not at all" },
  { value: 10, label: "A little (about 10%)" },
  { value: 25, label: "Some (about 25%)" },
  { value: 50, label: "About half" },
  { value: 75, label: "Mostly" },
] as const;

// States that still bar recovery when the injured person is even slightly at fault.
export const contributoryNegligenceStates = ["AL", "DC", "MD", "NC", "VA"];

// Too fact-specific for a multiplier: show no number, send to a lawyer instead.
export const noEstimateTypes = ["wrongful-death", "medical-malpractice"];

export type EstimateInput = {
  severity: (typeof severities)[number]["value"];
  medicalBills: number;
  futureMedical: number;
  lostWages: number;
  faultPercent: number;
};

export type Estimate = {
  economic: number;
  painLow: number;
  painHigh: number;
  grossLow: number;
  grossHigh: number;
  faultPercent: number;
  low: number;
  high: number;
  multiplierLow: number;
  multiplierHigh: number;
};

const clamp = (n: number) => (Number.isFinite(n) && n > 0 ? Math.min(n, 100_000_000) : 0);

export function estimate(input: EstimateInput): Estimate {
  const sev = severities.find((s) => s.value === input.severity) ?? severities[0];
  const medical = clamp(input.medicalBills) + clamp(input.futureMedical);
  const economic = medical + clamp(input.lostWages);
  const painLow = medical * sev.low;
  const painHigh = medical * sev.high;
  const keep = 1 - Math.min(Math.max(input.faultPercent, 0), 100) / 100;
  return {
    economic,
    painLow,
    painHigh,
    grossLow: economic + painLow,
    grossHigh: economic + painHigh,
    faultPercent: input.faultPercent,
    low: roundNice((economic + painLow) * keep),
    high: roundNice((economic + painHigh) * keep),
    multiplierLow: sev.low,
    multiplierHigh: sev.high,
  };
}

// Round to two significant figures so the range doesn't look falsely precise.
function roundNice(n: number) {
  if (n <= 0) return 0;
  const mag = Math.pow(10, Math.max(0, Math.floor(Math.log10(n)) - 1));
  return Math.round(n / mag) * mag;
}

export function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
