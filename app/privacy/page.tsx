import type { Metadata } from "next";
import { ProsePage } from "@/components/Prose";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

// TEMPLATE. Update to match what you actually collect and who you share it with, and have it
// reviewed for the state privacy laws that apply to you (for example CCPA/CPRA in California).
export default function Privacy() {
  return (
    <ProsePage title="Privacy policy" updated="October 4, 2026">
      <h2>What we collect</h2>
      <p>
        When you request a case review we collect your name, phone number, email address, the state and type of
        incident, and anything you choose to tell us about what happened. We also record technical details such as
        your IP address, browser, the page you came from, and the date and time you gave consent to be contacted.
      </p>
      <h2>How we use it</h2>
      <p>
        We use your information to contact you about your potential claim, to connect you with participating law
        firms, to keep a record of your consent, and to improve our website and advertising.
      </p>
      <h2>Who we share it with</h2>
      <p>
        We share your information with the participating law firms listed on our Partners page so they can evaluate
        your claim and contact you, and with service providers who help us run this website (such as hosting, email
        and phone providers). We do not sell your information to data brokers.
      </p>
      <h2>Your choices</h2>
      <p>
        You can opt out of text messages at any time by replying STOP, and you can ask us to stop calling or to delete
        your information by emailing <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
      <h2>Contact</h2>
      <p>{site.legalEntity} · <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p>
    </ProsePage>
  );
}
