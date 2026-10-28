# Integrations

The website itself is static and needs no third-party service to render. Two
business workflows require external providers, and both fail honestly when they
are not configured:

1. **Inquiry email** — a Cloudflare Worker validates submissions and sends them
   through [Resend](https://resend.com).
2. **Contracts** — status is tracked from [Dropbox Sign](https://www.dropbox.com/sign)
   webhooks; documents and signatures stay with the provider.

```text
Browser ──JSON──▶ Worker /api/inquiries ──▶ Resend ──▶ company inbox
                                                   └──▶ optional confirmation

Client  ──token─▶ Worker /api/contracts/status ──▶ KV (hashed token → status)
Dropbox Sign ──HMAC webhook──▶ Worker /api/webhooks/dropbox-sign ──▶ KV
```

The Worker code is in [`server/src/index.ts`](../server/src/index.ts). It has no
npm dependencies and runs on Cloudflare's free plan at typical company volumes.
No provider key is ever present in the browser bundle.

---

## 1. Inquiry email (Resend)

Resend is recommended for this project because it is a direct transactional
email API with a simple HTTP interface, a free tier suitable for a company site,
and no additional orchestration layer. The Worker calls it with `fetch`, so no
SDK or bundling is required. Provider pricing and limits change; confirm current
terms on your account before relying on the free tier.

### 1.1 Create the account and verify a domain

1. Create a Resend account.
2. Add the domain you will send from (for example `actorallc.com`).
3. Add the DNS records Resend gives you (SPF and DKIM) at your DNS provider.
4. Wait for verification. Until it passes, sending from that domain fails.
5. Create an API key with sending permission.

Use a dedicated mailbox such as `hello@actorallc.com` as the sender, and a real
company inbox as the recipient. Never use a personal address you do not monitor.

### 1.2 Create Cloudflare resources

```bash
npx wrangler login
npx wrangler kv namespace create ACTORA_RATE_LIMIT --config server/wrangler.toml
npx wrangler kv namespace create ACTORA_CONTRACTS  --config server/wrangler.toml
```

Paste both returned ids into `server/wrangler.toml`.

### 1.3 Set secrets

```bash
npx wrangler secret put RESEND_API_KEY     --config server/wrangler.toml
npx wrangler secret put FROM_EMAIL         --config server/wrangler.toml
npx wrangler secret put INQUIRY_TO_EMAIL   --config server/wrangler.toml
npx wrangler secret put ALLOWED_ORIGINS    --config server/wrangler.toml
npx wrangler secret put AUTO_REPLY         --config server/wrangler.toml
```

| Name | Example value | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | `re_…` | Server only |
| `FROM_EMAIL` | `Actora <hello@actorallc.com>` | Must be a verified domain |
| `INQUIRY_TO_EMAIL` | `company@actorallc.com` | Where briefs arrive |
| `ALLOWED_ORIGINS` | `https://actorallc.com,https://www.actorallc.com` | Comma-separated, no trailing slashes |
| `AUTO_REPLY` | `true` or `false` | Optional confirmation to the sender |

`ALLOWED_ORIGINS` is an allowlist. Requests from other origins receive `403`.
Requests with **no** Origin header (such as `curl`) are still accepted so the
endpoint can be tested, but rate limits apply.

### 1.4 Deploy and connect the frontend

```bash
npx wrangler deploy --config server/wrangler.toml
curl https://<worker-host>/healthz
```

`/healthz` returns booleans only — never secrets. Then set the GitHub repository
variable `VITE_INQUIRY_ENDPOINT=https://<worker-host>` (no trailing slash) and
re-run the site deployment. Locally, put the same value in `.env`.

Until this is done, both inquiry forms display "Form delivery is not connected
yet" and will not report a false success.

### 1.5 Behaviour and limits

- JSON only, 20 KB maximum body.
- Required fields are re-validated server-side with the same rules as the form.
- Honeypot (`website`) submissions return `200` and are discarded without
  sending, so bots learn nothing.
- Submissions faster than 2 seconds after form load are rejected (`422`).
- Six submissions per hashed IP per 15 minutes (`429` afterwards).
- A Resend rejection returns `502`; the visitor sees a failure and the company's
  direct email address.
- Inquiry bodies are **not** stored in KV. Rate-limit keys contain a SHA-256
  hash of the IP and expire in 15 minutes. Optional Resend logs are governed by
  your Resend account settings.
- Optional confirmation email fails independently; the company notification is
  what determines success.

### 1.6 Test it

```bash
curl -i -X POST https://<worker-host>/api/inquiries \
  -H 'content-type: application/json' \
  -H 'origin: https://actorallc.com' \
  --data '{
    "kind": "contact",
    "name": "Test Person",
    "email": "test@example.com",
    "message": "This is a test inquiry from the integration guide.",
    "consent": true,
    "elapsedMs": 5000,
    "website": ""
  }'
```

Expected: `200 {"ok":true,"id":"ACT-…"}` and an email in the company inbox.
Remove `RESEND_API_KEY` and retry: expected `503` with `ok:false`. That is the
test that proves the site cannot claim success without delivery.

The automated suite also covers success, validation failure, provider failure,
origin rejection, honeypot handling, rate limiting and webhook verification.

---

## 2. Contracts (Dropbox Sign)

The site does not create, display or store contract documents. It provides:

- a token-based **status** lookup;
- a documented **integration interface** for the company's chosen provider;
- a team-only **registration** endpoint that links a provider request to a
  status token.

### 2.1 Create the provider account

1. Create a Dropbox Sign account and complete its business verification.
2. Create an API key (Settings → API).
3. Decide how contracts are created. The reference Worker assumes an authorised
   team member creates the signature request in the provider dashboard, which is
   the least-privilege option. Automating creation requires additional provider
   scopes and is intentionally not implemented here.
4. Configure the provider's branding, reminder cadence and expiry defaults.

### 2.2 Configure the Worker

```bash
npx wrangler secret put DROPBOX_SIGN_API_KEY --config server/wrangler.toml
npx wrangler secret put ADMIN_TOKEN          --config server/wrangler.toml
```

`ADMIN_TOKEN` must be a long random value (32+ bytes). It is required for
`/api/contracts/register` and must never be shipped to the browser.

### 2.3 Register a request and issue a status token

After creating the signature request in the provider dashboard:

```bash
curl -X POST https://<worker-host>/api/contracts/register \
  -H "authorization: Bearer $ADMIN_TOKEN" \
  -H 'content-type: application/json' \
  --data '{
    "providerRequestId": "<provider signature_request_id>",
    "clientEmail": "client@example.com",
    "expiresAt": "2026-12-31T23:59:59Z"
  }'
```

The response contains a 64-character `token`. Send it to the client **through a
secure channel** — for example, in the signed proposal email or a password
manager share — alongside the provider's own signing email. The token grants
read-only status visibility, not document access. Only a SHA-256 hash is stored.

The client enters it at `/contracts#signing`.

### 2.4 Webhook

In the provider's settings, add:

```
https://<worker-host>/api/webhooks/dropbox-sign
```

Select the signature-request events. The Worker verifies Dropbox Sign's event
hash as `HMAC-SHA256(event_time + event_type, api_key)` using a timing-safe
comparison. Verify this against the provider's current documentation if they
change their scheme; the implementation is isolated in `handleWebhook`.

Status mapping:

| Provider event | Recorded status |
| --- | --- |
| `signature_request_sent` | `sent` |
| `signature_request_viewed` | `viewed` |
| `signature_request_signed` (one signer) | `viewed` — **not** treated as fully executed |
| `signature_request_all_signed` | `signed` |
| `signature_request_declined` | `declined` |
| `signature_request_expired` | `expired` |

Terminal states (`signed`, `declined`) cannot be regressed by a late event.
Unknown or unauthenticated events are acknowledged without changing records.

### 2.5 Connect the frontend

1. Set `VITE_CONTRACT_API_ENDPOINT=https://<worker-host>` as a repository
   variable and rebuild.
2. Update the provider disclosure in `src/config/site.ts` if you use a different
   provider.
3. The `/contracts` page will show "Status API connected" instead of the setup
   notice; `/healthz` reports `contracts: true`.

Without these values the lookup is disabled and the page says so. There is no
simulated signing flow anywhere in the codebase.

### 2.6 Costs and legal review

- Dropbox Sign has historically offered a limited free/trial allowance and paid
  plans or pay-as-you-go envelopes. **Pricing changes**; confirm the current
  cost in your provider account and decide how it is passed on before issuing
  requests. Do not add a price to the website without verifying it.
- An e-signature provider supplies an audit trail and completion evidence, not
  legal advice. Have contracts reviewed by qualified counsel, and make sure the
  provider's terms and data-processing terms are acceptable to the company and
  its clients.
- The Privacy Policy names the provider. Update it if you switch.

### 2.7 Switching providers

The frontend is provider-agnostic: it consumes `{ status, updatedAt, provider }`
from the status endpoint. To use SignWell, DocuSign or Adobe Acrobat Sign:

1. Implement status lookup and webhook verification in `server/src/index.ts`,
   keeping the same response shape and terminal-state rules.
2. Update `site.integrations.signatureProvider` and its disclosure text.
3. Update this document and the Privacy Policy.
4. Test signature verification against the provider's documented scheme.

---

## 3. Not included (by design)

- **Analytics** — no tracking scripts are loaded. If you add one, update the
  Privacy Policy and use a consent mechanism where required.
- **Newsletter** — the footer section is hidden (`site.newsletter.enabled`).
  Choose a provider, add double opt-in and a privacy notice before enabling it.
- **CMS** — Markdown + pull requests is the publishing workflow. A Git-based CMS
  can be added later without moving the site off static hosting.
- **File uploads** — the inquiry forms do not accept files. Use a provider's
  secure link flow for documents.

## 4. Production checklist

- [ ] Domain verified in Resend; SPF and DKIM present.
- [ ] `FROM_EMAIL` and `INQUIRY_TO_EMAIL` are monitored mailboxes.
- [ ] `ALLOWED_ORIGINS` lists only production origins.
- [ ] `AUTO_REPLY` decision made.
- [ ] KV namespaces are in the correct Cloudflare account.
- [ ] `healthz` reports both services correctly.
- [ ] A real test inquiry arrives, and a fake failure shows an error (not success).
- [ ] Contract webhook verified with a test envelope; a partial signature is not
      reported as fully signed.
- [ ] Provider disclosure, retention text and Privacy Policy reviewed.
- [ ] `VITE_INQUIRY_ENDPOINT` / `VITE_CONTRACT_API_ENDPOINT` set and deployed.
- [ ] Rate-limit and email volume levels are acceptable for expected traffic.
