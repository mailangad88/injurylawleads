import type { Metadata } from "next";
import Link from "next/link";
import { ExplainerVideo } from "@/components/ExplainerVideo";
import { videos } from "@/remotion/videos";

export const metadata: Metadata = {
  title: "Injury Explainer Videos",
  description: "Short videos explaining what to do after an accident and how injury claims work.",
  alternates: { canonical: "/videos" },
};

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-extrabold text-slate-900">Explainer videos</h1>
      <p className="mt-3 text-lg text-slate-600">Quick, plain-English answers to the most common injury questions.</p>
      {videos.map((v) => (
        <section key={v.slug} className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">{v.props.title}</h2>
          <p className="mt-1 text-slate-600">{v.description}</p>
          <ExplainerVideo slug={v.slug} />
          {v.guideHref && <Link href={v.guideHref} className="font-semibold text-blue-800">Read the full guide →</Link>}
        </section>
      ))}
    </div>
  );
}
