# MCP servers

`.mcp.json` at the repo root adds 11 MCP servers to Claude Code for anyone who opens this repo. Each one helps with getting, converting or following up on leads. The research behind the picks (why these, what each costs, legal risk) is in the project's `research/lead-gen-mcp-servers.md`.

OpenSEO is set up separately at user scope, see [openseo-self-hosting.md](openseo-self-hosting.md).

## First-time setup

1. **Install the runners:** Node 20+ (for `npx`), [uv](https://docs.astral.sh/uv/) (for `uvx`), [pipx](https://pipx.pypa.io/) and the [gcloud CLI](https://cloud.google.com/sdk/docs/install).
2. **Credentials:** `cp .env.mcp.example .env.mcp` and fill in what you have. `.env.mcp` is gitignored. Never commit keys, because this repo is public.
3. **Start Claude Code with them loaded:**
   ```bash
   set -a; source .env.mcp; set +a; claude
   ```
4. Claude Code asks you to approve the project's servers the first time. Approve the ones you've set up. Run `/mcp` to see status and to sign in to the OAuth servers (Meta Ads, Resend).

A server whose variables aren't set shows a "missing variable" warning in `claude mcp list` and won't connect. The other servers still work, so you can set them up one at a time.

## The servers

| Name | What it's for | What you need | Cost |
|---|---|---|---|
| `gsc` | Real search queries, clicks and rankings per guide; indexing and sitemaps | Search Console property + OAuth client file | Free |
| `google-analytics` | Which guides and sources turn into form submissions | GA4 on the site + Google Cloud project | Free |
| `google-ads` | Search terms, cost per lead, wasted spend; can add ad assets and labels | Google Ads account + Google Cloud project | Free (ad spend separate) |
| `clarity` | Where visitors drop off the form, rage clicks, scroll depth | Clarity project + API token | Free |
| `chrome-devtools` | Page speed, Core Web Vitals, debugging the live form on mobile | Chrome installed locally | Free |
| `meta-ads` | Facebook/Instagram campaign and lead-ad performance | Meta Business account + Pipeboard sign-in | Free plan |
| `resend` | Audiences, broadcasts, delivery problems on alert emails | Existing Resend account (OAuth) | Existing plan |
| `twilio` | 10DLC registration and messaging-service admin only | Twilio API key | Existing plan |
| `n8n` | Builds and checks n8n workflows (e.g. callback retries) | Nothing; add n8n API vars once you run n8n | Free |
| `reddit` | Read-only research into the questions injured people ask | Reddit "script" app | Free |
| `firecrawl` | Reads competitor and top-ranking pages for content gaps | Firecrawl API key | Free tier, then credits |

### Google: Search Console, Analytics 4, Ads

All three use one Google Cloud project. Put its ID in `GOOGLE_CLOUD_PROJECT`.

1. In [Google Cloud console](https://console.cloud.google.com/), create a project and enable the **Google Analytics Admin API**, **Google Analytics Data API**, **Google Ads API** and **Google Search Console API**.
2. For Analytics and Ads, sign in once with Application Default Credentials covering both scopes:
   ```bash
   gcloud auth application-default login \
     --scopes https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/adwords,https://www.googleapis.com/auth/cloud-platform
   gcloud auth application-default set-quota-project "$GOOGLE_CLOUD_PROJECT"
   ```
   Google retired Ads developer tokens on 2026-09-09, so none is needed. If you reach the Ads account through a manager account, set `GOOGLE_ADS_LOGIN_CUSTOMER_ID` and add it to the `google-ads` env block in `.mcp.json`.
3. For Search Console, create an **OAuth client ID** of type **Desktop app** (APIs & Services → Credentials), download the JSON, and put its absolute path in `GSC_OAUTH_CLIENT_SECRETS_FILE`. The first tool call opens a browser to sign in. It's read-only unless `GSC_ALLOW_DESTRUCTIVE=true`, so leave that unset.
4. GA4 must be on the site for `google-analytics` to return anything. Track a `lead_submitted` event with **no** name, phone, email or injury details.

The Google Ads server can create ad assets and labels (each write needs a second confirming call), but it can't change budgets, bids, keywords or campaigns. For strictly read-only use, see `tools_config.yaml` in [its README](https://github.com/googleads/google-ads-mcp).

### Microsoft Clarity

Create a project at [clarity.microsoft.com](https://clarity.microsoft.com), then Settings → Data Export → generate an API token and put it in `CLARITY_API_TOKEN`. The Clarity tracking script isn't on the site yet.

> **Before adding the Clarity script:** session recording has drawn class actions under state wiretap laws (California's CIPA in particular). Turn on strict masking for all form fields, say so in the privacy policy, and get the lawyer reviewing the TCPA text to sign off.

### Meta Ads (Pipeboard)

Uses Pipeboard's hosted server, which runs [pipeboard-co/meta-ads-mcp](https://github.com/pipeboard-co/meta-ads-mcp) (BSL 1.1, which becomes Apache-2.0 in 2029). Run `/mcp`, pick `meta-ads` and sign in, then connect your ad account at pipeboard.co. Pipeboard gets access to the ad account. Self-hosting is possible but needs your own Meta developer app. New campaigns start paused and writes need confirmation.

Don't send injury type or medical details to the Meta Pixel or Conversions API.

### Resend

Uses Resend's official hosted server. Run `/mcp`, pick `resend` and sign in with OAuth. To use an API key instead, see [resend-mcp](https://github.com/resend/resend-mcp). Only email people who opted in. Marketing email needs an unsubscribe link and a physical address (CAN-SPAM).

### Twilio (admin only)

Create a **Standard API key** in the Twilio console (Account → API keys) and fill in `TWILIO_MCP_API_KEY` and `TWILIO_MCP_API_SECRET`. `TWILIO_ACCOUNT_SID` is the same one the site uses.

It's limited to `--services twilio_messaging_v1`: messaging services and A2P 10DLC brand and campaign registration. It deliberately leaves out the core API that sends texts and places calls. **Don't widen it to have an AI text or call leads.** That needs TCPA-compliant written consent for each contact, and AI voices count as "artificial" under the FCC's 2024 ruling.

### n8n

Works right away in docs mode: it knows every n8n node and can draft and validate workflows. Once you run n8n (self-hosted or n8n Cloud), add `N8N_API_URL` and `N8N_API_KEY` to the `n8n` env block in `.mcp.json` so it can create and update workflows on your instance. The lead webhook (`LEAD_WEBHOOK_URL`) can point at an n8n catch hook.

### Reddit (research only)

Reddit ended logged-out access on 2026-11-13, so the server needs app credentials. Create a "script" app at [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps). Reddit may ask you to describe the use case. Write access stays off because `REDDIT_BUDDY_WRITE` isn't set, so keep it that way.

**Never reply to, DM or recruit posters.** Contacting specific injured people is solicitation under attorney ethics rules (ABA Model Rule 7.3 and state versions). Don't republish posts either.

### Firecrawl

Get a key at [firecrawl.dev](https://firecrawl.dev) and put it in `FIRECRAWL_API_KEY`. Use it to read pages for research. Respect robots.txt and never copy competitor text ([CONTENT_STYLE.md](CONTENT_STYLE.md)).

## Turning a server off

Run `/mcp` and disable it, or add its name to `disabledMcpjsonServers` in your own `.claude/settings.local.json`.
