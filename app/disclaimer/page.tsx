import type { Metadata } from "next";
import { ProsePage } from "@/components/Prose";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Disclaimer", alternates: { canonical: "/disclaimer" } };

// TEMPLATE. Have an attorney licensed in each state you advertise in review this page.
export default function Disclaimer() {
  return (
    <ProsePage title="Disclaimer" updated="October 4, 2026">
      <p><strong>Attorney advertising.</strong> This website may be considered attorney advertising in some jurisdictions.</p>
      <p>
        {site.name} is owned and operated by {site.legalEntity}. We are not a law firm, we are not a lawyer referral
        service certified by any state bar unless stated otherwise, and we do not provide legal advice. No attorney
        is responsible for the content of this website except as stated on a specific page.
      </p>
      <p>
        Using this website, submitting a form, or speaking with our intake team does not create an attorney-client
        relationship with us or with any law firm. An attorney-client relationship is formed only when you and an
        attorney sign a written agreement.
      </p>
      <p>
        The information on this site is general in nature, may not reflect the latest legal developments, and may not
        apply to your situation. Laws, deadlines and procedures differ from state to state. Do not act or decline to act
        based on this information without talking to a licensed attorney in your state.
      </p>
      <p>
        Participating attorneys are independent and are not employees or agents of {site.legalEntity}. We do not
        endorse or guarantee any attorney, and we do not guarantee that any attorney will accept your case. Any
        results described on this site do not guarantee a similar outcome.
      </p>
    </ProsePage>
  );
}
