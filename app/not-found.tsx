import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold text-slate-900">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you were looking for has moved or does not exist.</p>
      <Link href="/guides" className="mt-6 inline-block text-blue-800 underline">Browse injury guides</Link>
    </div>
  );
}
