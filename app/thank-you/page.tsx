import type { Metadata } from "next";
import Link from "next/link";
import { site, telHref } from "@/lib/site";

export const metadata: Metadata = { title: "Thank You", robots: { index: false, follow: false } };

export default async function ThankYou(props: PageProps<"/thank-you">) {
  const sp = await props.searchParams;
  const cold = sp.p === "c";
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">✓</div>
      <h1 className="mt-6 text-3xl font-extrabold text-slate-900">We received your request</h1>
      {cold ? (
        <p className="mt-4 text-lg text-slate-600">
          Thanks for reaching out. A member of our team will review what you shared and follow up if we can help.
        </p>
      ) : (
        <p className="mt-4 text-lg text-slate-600">
          Keep your phone nearby. Our intake team will call you {site.callbackPromise} to learn a bit more about what
          happened.
        </p>
      )}
      {site.phone && (
        <a href={telHref(site.phone)} className="mt-8 inline-block rounded-lg bg-amber-500 px-6 py-3 text-lg font-bold text-slate-900">
          Or call us now: {site.phone}
        </a>
      )}
      <div className="mt-10 rounded-xl border border-slate-200 p-6 text-left">
        <h2 className="font-bold text-slate-900">While you wait, have these handy</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600">
          <li>The date and location of the accident</li>
          <li>Any police or incident report number</li>
          <li>Insurance information for you and anyone else involved</li>
          <li>Names of doctors or hospitals that treated you</li>
          <li>Photos of the scene, vehicles or injuries</li>
        </ul>
      </div>
      <Link href="/guides" className="mt-8 inline-block text-blue-800 underline">Read our injury guides</Link>
    </div>
  );
}
