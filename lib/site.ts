// Public, non-secret site settings. Override with NEXT_PUBLIC_* env vars.
export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Injury Claim Guide",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  tagline: "Free, plain-English help after an accident, and a fast connection to an injury lawyer.",
  // Leave empty until you have a real, staffed number. The call buttons only render when this is set.
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  // How quickly you promise a call back. Only promise what your team can actually do.
  callbackPromise: process.env.NEXT_PUBLIC_CALLBACK_PROMISE || "within minutes during business hours",
  legalEntity: process.env.NEXT_PUBLIC_LEGAL_ENTITY || "[Your Company LLC]",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@example.com",
};

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
