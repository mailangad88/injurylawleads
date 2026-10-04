import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/Prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works",
  description: `How ${site.name} connects injured people with participating personal injury lawyers, and how we are paid.`,
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorks() {
  return (
    <ProsePage title="How it works">
      <p>
        {site.name} helps people who have been hurt understand their options and get in touch with a personal injury
        lawyer quickly. We are not a law firm and we do not give legal advice.
      </p>
      <h2>1. You tell us what happened</h2>
      <p>You answer a few short questions online or by phone. It takes about a minute.</p>
      <h2>2. Our intake team calls you</h2>
      <p>
        A member of our team calls you {site.callbackPromise} to gather the basic facts, such as when and where it
        happened and what injuries you have.
      </p>
      <h2>3. We connect you with a participating lawyer</h2>
      <p>
        If your situation is one our participating attorneys handle, we share your information with a firm licensed
        in your state so they can contact you for a free consultation. You are never obligated to hire anyone.
      </p>
      <h2>How we are paid</h2>
      {/* Describe your real business model here, accurately. Many states regulate how a marketing
          company may be paid by lawyers; have your counsel confirm the wording matches your contracts. */}
      <p>
        Our service is free for you. Participating law firms pay us for advertising and marketing services. We do not
        receive a share of any attorney fee or of your recovery, and participating firms make their own decisions about
        whether to take your case.
      </p>
      <p><Link href="/partners">See participating law firms</Link></p>
    </ProsePage>
  );
}
