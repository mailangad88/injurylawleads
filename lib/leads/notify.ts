import { categories } from "../categories";
import { whenOptions, type Lead } from "./schema";

// Instant alerts so someone can call the lead back within minutes. Each channel
// turns on when its env vars are set; configure at least one before launch.

function label(lead: Lead) {
  const type = categories.find((c) => c.slug === lead.incidentType)?.short ?? lead.incidentType;
  const when = whenOptions.find((w) => w.value === lead.incidentWhen)?.label ?? lead.incidentWhen;
  return { type, when };
}

function summaryLines(lead: Lead) {
  const { type, when } = label(lead);
  return [
    `${lead.priority.toUpperCase()} lead: ${lead.firstName} ${lead.lastName}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `What happened: ${type} in ${lead.state}, ${when.toLowerCase()}`,
    `Medical treatment: ${lead.medicalTreatment}. Already has a lawyer: ${lead.hasAttorney}`,
    lead.description ? `Details: ${lead.description}` : null,
    lead.tracking.context ? `Context: ${lead.tracking.context}` : null,
    `Source: ${lead.tracking.pageUrl ?? "unknown"}`,
    `Lead ID: ${lead.id}`,
  ].filter(Boolean) as string[];
}

async function sendEmail(lead: Lead) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_ALERT_EMAIL_TO;
  const from = process.env.LEAD_ALERT_EMAIL_FROM;
  if (!key || !to || !from) return "skipped";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      subject: `[${lead.priority.toUpperCase()}] New injury lead: ${label(lead).type}, ${lead.state}`,
      text: summaryLines(lead).join("\n"),
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
  return "sent";
}

async function sendSms(lead: Lead) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  const to = process.env.LEAD_ALERT_SMS_TO;
  if (!sid || !token || !from || !to) return "skipped";
  const { type } = label(lead);
  // Keep SMS short and light on personal details: it goes to your own staff phones.
  const body = `${lead.priority.toUpperCase()} lead: ${lead.firstName}, ${type}, ${lead.state}. Call ${lead.phone} now.`;
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  await Promise.all(
    to.split(",").map(async (recipient) => {
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ From: from, To: recipient.trim(), Body: body }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`Twilio ${res.status}`);
    }),
  );
  return "sent";
}

async function sendSlack(lead: Lead) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return "skipped";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: summaryLines(lead).join("\n") }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Slack ${res.status}`);
  return "sent";
}

export async function notifyNewLead(lead: Lead) {
  const channels = { email: sendEmail, sms: sendSms, slack: sendSlack };
  const results = await Promise.allSettled(Object.values(channels).map((fn) => fn(lead)));
  const report: Record<string, string> = {};
  Object.keys(channels).forEach((name, i) => {
    const r = results[i];
    report[name] = r.status === "fulfilled" ? r.value : `failed: ${r.reason}`;
  });
  return report;
}
