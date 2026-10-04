import type { ReactNode } from "react";

export function ProsePage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-extrabold text-slate-900">{title}</h1>
      {updated && <p className="mt-2 text-sm text-slate-500">Last updated {updated}</p>}
      <div className="prose prose-slate mt-8 max-w-none prose-a:text-blue-800">{children}</div>
    </div>
  );
}
