import fs from "node:fs/promises";
import path from "node:path";
import type { Lead } from "./schema";

// Where leads are saved. Set LEAD_STORE to one of:
//   webhook  POST each lead as JSON to LEAD_WEBHOOK_URL (Zapier, Make, n8n, a CRM,
//            or your own API). Recommended for production.
//   file     Append to data/leads.ndjson. For local development only: serverless
//            hosts have no persistent disk, and data/ is gitignored.
// With nothing set, development uses "file" and production uses "webhook".
type StoreResult = { ok: true; store: string } | { ok: false; store: string; error: string };

export async function saveLead(lead: Lead): Promise<StoreResult> {
  const store = process.env.LEAD_STORE || (process.env.NODE_ENV === "production" ? "webhook" : "file");
  try {
    if (store === "file") {
      const dir = path.join(process.cwd(), "data");
      await fs.mkdir(dir, { recursive: true });
      await fs.appendFile(path.join(dir, "leads.ndjson"), JSON.stringify(lead) + "\n", "utf8");
      return { ok: true, store };
    }
    if (store === "webhook") {
      const url = process.env.LEAD_WEBHOOK_URL;
      if (!url) return { ok: false, store, error: "LEAD_WEBHOOK_URL is not set" };
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.LEAD_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_SECRET}` } : {}),
        },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return { ok: false, store, error: `Webhook responded ${res.status}` };
      return { ok: true, store };
    }
    return { ok: false, store, error: `Unknown LEAD_STORE "${store}"` };
  } catch (err) {
    return { ok: false, store, error: err instanceof Error ? err.message : String(err) };
  }
}
