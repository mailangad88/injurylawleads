# Injury Claim Guide (injurylawleads)

A personal injury lead generation site: an educational content engine that turns readers into callback requests, with instant alerts so your intake team can call a new lead within minutes.

Built with Next.js 16 (App Router), MDX content, Tailwind CSS 4 and Remotion for programmatic explainer videos.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional locally
npm run dev                  # http://localhost:3000
```

Locally, leads are appended to `data/leads.ndjson` (gitignored). **This repo is public: never commit `.env*` files or lead data.**

## How a lead flows

1. A visitor reads a guide or lands on `/free-case-review` from an ad (prefill with `?type=car-accidents&state=TX`).
2. The two-step form asks qualifying questions first (what happened, state, when, treatment, already has a lawyer), then contact details and TCPA consent.
3. The server action (`app/actions.ts`) validates the input, blocks obvious bots (honeypot, minimum fill time, per-IP rate limit), scores the lead `hot` / `warm` / `cold`, and records consent proof: consent text version and hash, timestamp, IP, user agent, landing page and UTM tags.
4. In parallel it **stores** the lead (`lib/leads/store.ts`) and **alerts** your team (`lib/leads/notify.ts`) by email (Resend), SMS (Twilio) and/or Slack.
5. The visitor lands on `/thank-you` with what to have ready for the call. If storage and every alert fail, the visitor sees an error instead of a false confirmation.

### Production storage

Serverless hosts have no persistent disk, so in production set `LEAD_STORE=webhook` and point `LEAD_WEBHOOK_URL` at a Zapier/Make/n8n hook, your CRM, or your own API. Configure at least one alert channel so nobody waits.

## The content engine

Guides live in `content/guides/<category>/<slug>.mdx`. Categories are defined in `lib/categories.ts`; each one gets a hub page at `/guides/<category>` and an option on the lead form.

```bash
npm run new-guide -- car-accidents "Rear-End Collision Claims"
```

Frontmatter is validated at build time (`lib/content.ts`):

| Field | Notes |
| --- | --- |
| `title`, `description` | Description must be 50 to 200 characters (it becomes the meta description). |
| `updated` | Date shown on the page and in the sitemap. |
| `featured` | Shows the guide on the home page. |
| `draft` | Hidden until removed. |
| `faqs` | Rendered on the page and emitted as FAQPage structured data. |
| `reviewedBy` | Only set when a licensed attorney actually reviewed the page. |

Components you can use in any guide without importing: `<CaseReviewCTA />`, `<KeyTakeaways>`, `<Callout type="warning">`, `<ExplainerVideo slug="..." />`.

Every page ships with canonical URLs, Article and Breadcrumb JSON-LD, a sitemap and robots.txt.

### Content rules (attorney advertising)

- No fake testimonials, invented case results, or guaranteed outcomes.
- Don't state specific legal deadlines or dollar amounts unless verified for that state and dated.
- Keep the "not a law firm" disclaimer in the footer and on every video.

## Videos (Remotion)

Explainer videos are React components in `remotion/`, driven by the data in `remotion/videos.ts`. They play in the page through `@remotion/player`, so no video files are needed.

```bash
npm run video:studio   # preview and edit in Remotion Studio
npm run video:render   # render all videos to public/videos/<slug>.mp4 (for YouTube, social, ads)
```

Remotion is free for individuals and companies with up to 3 employees; larger companies need a [company license](https://remotion.dev/license).

## Before launch: compliance checklist

This code is not legal advice. Have a lawyer review the business model and the pages below before you take real leads.

- [ ] **How you get paid.** Many state bar rules forbid lawyers from paying for referrals or sharing fees with non-lawyers, so a per-signed-case commission or a share of the fee is often not allowed. Flat advertising or per-lead fees are more common, and some states require lawyer referral services to be registered or certified.
- [ ] **TCPA consent.** Review the consent wording in `lib/leads/consent.ts` and bump `CONSENT_VERSION` whenever it changes. List every firm that may call or text on `/partners`. Check state telemarketing laws (e.g. Florida, Oklahoma, Maryland) and call-time rules.
- [ ] **Advertising rules.** "Attorney advertising" labels, disclaimers and filing requirements vary by state.
- [ ] **Privacy.** Update `/privacy` to match what you collect and share (CCPA/CPRA and other state laws).
- [ ] **Legal pages.** `/disclaimer`, `/terms`, `/how-it-works` and `/partners` are templates with placeholders.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / server |
| `npm run typecheck` | Generate route types and run TypeScript |
| `npm run new-guide` | Scaffold a guide |
| `npm run video:studio` / `video:render` | Remotion Studio / render MP4s |
