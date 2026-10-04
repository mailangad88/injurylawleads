import { createHash } from "node:crypto";
import { site } from "../site";

// The exact consent language shown next to the checkbox. Every lead stores the
// version and a hash of this text so you can prove what the person agreed to.
//
// HAVE A LAWYER REVIEW THIS BEFORE GOING LIVE. Calls and texts made with an
// autodialer or prerecorded voice need prior express written consent under the
// TCPA, and some states (for example Florida, Oklahoma and Maryland) add their
// own telemarketing rules. Best practice is to name the specific law firms that
// may call, rather than a vague "partners" list.
export const CONSENT_VERSION = "2026-10-04.v1";

export function consentText() {
  return (
    `By checking this box and clicking "Get my free case review", I give my express written consent for ` +
    `${site.name} and the participating attorneys or law firms listed on our Partners page to contact me ` +
    `about my potential claim at the phone number and email I provided, including by calls and text messages ` +
    `that may use an automatic telephone dialing system, artificial or prerecorded voice, or AI-generated voice, ` +
    `even if my number is on a do-not-call list. Consent is not a condition of any purchase or service, and I can ` +
    `call us instead. Message and data rates may apply. Message frequency varies. Reply STOP to opt out of texts. ` +
    `I agree to the Terms and Privacy Policy, and I understand that submitting this form does not create an ` +
    `attorney-client relationship.`
  );
}

export function consentHash() {
  return createHash("sha256").update(consentText()).digest("hex").slice(0, 16);
}
