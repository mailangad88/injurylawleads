# OpenSEO: self-hosting for keyword research and rank tracking

[OpenSEO](https://github.com/every-app/open-seo) is an open-source (MIT) alternative to Semrush and Ahrefs. We run it as its own app, separate from this site, on Cloudflare's free plan. SEO data comes from DataForSEO, which bills per request.

Steps summarized from the upstream [Cloudflare guide](https://github.com/every-app/open-seo/blob/main/docs/SELF_HOSTING_CLOUDFLARE.md) and [DataForSEO key guide](https://github.com/every-app/open-seo/blob/main/docs/DATAFORSEO_API_KEY.md) as of 2026-10-04. If they disagree with this page, follow upstream.

## What you need

- Node 22.6+ and pnpm (`corepack enable`)
- A Cloudflare account with **R2 activated**. Activating R2 requires a payment method even on the free plan.
- A DataForSEO account. New accounts get $1 of free credit, and the minimum top-up is $50.

## 1. Get the DataForSEO key

1. Sign up at [app.dataforseo.com](https://app.dataforseo.com/api-access) and request API credentials.
2. Copy the **Base64** credentials value. It is `email:api-password` base64-encoded, and it is your `DATAFORSEO_API_KEY`.

Keep it out of this repo (it's public).

## 2. Deploy to Cloudflare

```bash
git clone https://github.com/every-app/open-seo.git
cd open-seo
pnpm install
pnpm alchemy login                 # approve the OAuth scopes, including access:write
pnpm alchemy cloudflare bootstrap
cp .env.selfhost.example .env.selfhost
```

Fill in `.env.selfhost`:

| Variable | Value |
| --- | --- |
| `ACCESS_ALLOWED_EMAILS` | Email addresses allowed to sign in (yours, and teammates) |
| `DATAFORSEO_API_KEY` | The Base64 value from step 1 |
| `TEAM_DOMAIN`, `POLICY_AUD` | Optional, only if you manage Cloudflare Access yourself |

Then deploy:

```bash
pnpm deploy:selfhost --yes
```

This creates the D1 database, KV namespaces, R2 bucket, Worker and Cloudflare Access login. Open the Worker URL it prints and sign in.

- **Update:** `git pull && pnpm install && pnpm deploy:selfhost --yes`
- **Add a teammate:** add their email to `ACCESS_ALLOWED_EMAILS` and redeploy.
- **Remove everything:** `pnpm alchemy destroy --env-file .env.selfhost --stage selfhost`

## 3. Connect it to Claude (optional)

OpenSEO has an MCP server, so Claude can run keyword research directly. The hosted version connects with:

```bash
claude mcp add --transport http --scope user openseo https://app.openseo.so/mcp
```

For a self-hosted instance, use your Worker URL with `/mcp` in place of `https://app.openseo.so/mcp`. That path is inferred from the hosted docs, so confirm it in [OpenSEO's MCP docs](https://openseo.so/docs/mcp). Cloudflare Access sits in front of the Worker, so the MCP client needs to get through that login.

## How we use it

1. **Pick topics.** For each launch state, pull injury keywords ("truck accident lawyer houston", "what to do after a car accident texas") with volume and difficulty.
2. **Prioritize.** Rank by search volume, how hard the keyword is to rank for, and how likely it is to lead to a case. Turn the top results into briefs with `npm run new-guide`.
3. **Find gaps.** Compare competitor domains to see the pages that win traffic and that we don't have yet.
4. **Track.** Add every published guide's target keyword to rank tracking and run a monthly site audit.
5. **Watch spend.** Every query costs DataForSEO credit. Research one state and case type at a time.
