import type { Metadata } from "next";
import { ProsePage } from "@/components/Prose";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Use", alternates: { canonical: "/terms" } };

// TEMPLATE. Have counsel review before launch.
export default function Terms() {
  return (
    <ProsePage title="Terms of use" updated="October 4, 2026">
      <p>
        These terms govern your use of {site.name}, operated by {site.legalEntity}. By using this website you agree
        to them.
      </p>
      <h2>No legal advice</h2>
      <p>
        Content on this site is general information only. We are not a law firm and do not provide legal advice. See
        our Disclaimer for more.
      </p>
      <h2>Your submissions</h2>
      <p>
        You agree that the information you submit is accurate and is your own, and that you are at least 18 years old.
        You agree to be contacted as described in the consent you give on our forms. You can withdraw that consent at
        any time.
      </p>
      <h2>Communications</h2>
      <p>
        If you consent, we and participating law firms may contact you by phone, text and email, including with
        automated technology. Message and data rates may apply. Reply STOP to opt out of texts or HELP for help.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        This site is provided as is. To the extent allowed by law, {site.legalEntity} is not liable for any decision
        you make based on its content or for the services of any participating attorney.
      </p>
    </ProsePage>
  );
}
