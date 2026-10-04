import { z } from "zod";
import { categories } from "../categories";
import { stateCodes } from "../states";

export const whenOptions = [
  { value: "7d", label: "In the last week" },
  { value: "30d", label: "In the last month" },
  { value: "6m", label: "1 to 6 months ago" },
  { value: "12m", label: "6 to 12 months ago" },
  { value: "24m", label: "1 to 2 years ago" },
  { value: "older", label: "More than 2 years ago" },
] as const;

export const treatmentOptions = [
  { value: "yes", label: "Yes" },
  { value: "not-yet", label: "Not yet" },
  { value: "no", label: "No" },
] as const;

const enumOf = <T extends readonly { value: string }[]>(opts: T) =>
  z.enum(opts.map((o) => o.value) as [T[number]["value"], ...T[number]["value"][]]);

export function normalizeUsPhone(input: string) {
  const digits = input.replace(/\D/g, "");
  const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  // NANP: area code and exchange can't start with 0 or 1.
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(ten) ? `+1${ten}` : null;
}

export const leadSchema = z.object({
  incidentType: z.enum(categories.map((c) => c.slug) as [string, ...string[]], {
    message: "Choose what happened",
  }),
  state: z.enum(stateCodes as [string, ...string[]], { message: "Choose your state" }),
  incidentWhen: enumOf(whenOptions),
  medicalTreatment: enumOf(treatmentOptions),
  hasAttorney: z.enum(["yes", "no"], { message: "Let us know if you already have a lawyer" }),
  firstName: z.string().trim().min(1, "Enter your first name").max(60),
  lastName: z.string().trim().min(1, "Enter your last name").max(60),
  phone: z
    .string()
    .transform((v, ctx) => {
      const n = normalizeUsPhone(v);
      if (!n) ctx.addIssue({ code: "custom", message: "Enter a valid US phone number" });
      return n ?? "";
    }),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(120),
  description: z.string().trim().max(1500).optional().default(""),
  consent: z.literal("on", { message: "Please check the box so we can call you back" }),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type Lead = LeadInput & {
  id: string;
  createdAt: string;
  priority: "hot" | "warm" | "cold";
  consent: "on";
  consentVersion: string;
  consentHash: string;
  tracking: {
    ip: string | null;
    userAgent: string | null;
    pageUrl: string | null;
    referrer: string | null;
    utm: Record<string, string>;
  };
};
