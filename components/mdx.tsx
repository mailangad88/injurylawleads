import Link from "next/link";
import type { ReactNode } from "react";
import { ExplainerVideo } from "./ExplainerVideo";

// Components available inside any .mdx guide without importing them.

export function CaseReviewCTA({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="not-prose my-8 rounded-2xl bg-slate-950 p-6 text-white">
      <p className="text-xl font-bold">{title ?? "Wondering if you have a case?"}</p>
      <p className="mt-2 text-blue-100">
        {children ?? "Answer a few quick questions. A participating injury lawyer can review your situation for free, and you only pay if they win."}
      </p>
      <Link href="/free-case-review" className="mt-4 inline-block rounded-lg bg-yellow-400 px-5 py-3 font-bold text-slate-900 hover:bg-yellow-300">
        Start my free case review
      </Link>
    </div>
  );
}

export function KeyTakeaways({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-xl border-l-4 border-yellow-400 bg-yellow-50 px-5 py-1">
      <p className="!mb-0 font-semibold text-slate-900">Key takeaways</p>
      {children}
    </div>
  );
}

export function Callout({ type = "info", children }: { type?: "info" | "warning"; children: ReactNode }) {
  const styles = type === "warning" ? "border-red-300 bg-red-50" : "border-blue-200 bg-blue-50";
  return <div className={`my-6 rounded-xl border px-5 py-1 ${styles}`}>{children}</div>;
}

export const mdxComponents = {
  CaseReviewCTA,
  KeyTakeaways,
  Callout,
  ExplainerVideo,
  a: (props: React.ComponentProps<"a">) =>
    props.href?.startsWith("/") ? <Link href={props.href}>{props.children}</Link> : <a {...props} rel="noopener noreferrer" target="_blank" />,
};
