// Best-effort, per-instance limiter to blunt form spam. For multi-instance
// deployments put a shared limiter (for example Upstash or your WAF) in front.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX = 5;

export function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) hits.clear();
  return recent.length > MAX;
}
