# Actora API (Cloudflare Worker)

The website is static. This Worker is the only server-side component: it
validates inquiries, applies rate limits, sends email through Resend, and
maintains contract status driven by verified e-signature webhooks.

It contains **no front-end secrets** and no provider keys are ever shipped to
the browser.

## Routes

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/inquiries` | public, rate limited | Contact and project briefs |
| `POST` | `/api/contracts/status` | access token | Read-only contract status |
| `POST` | `/api/contracts/register` | `ADMIN_TOKEN` bearer | Map a provider request id to a status token |
| `POST` | `/api/webhooks/dropbox-sign` | HMAC signature | Provider status events |
| `GET` | `/healthz` | public | Readiness without secrets |

## Local development

```bash
npx wrangler dev --config server/wrangler.toml --local
```

For local KV, Wrangler creates a local namespace automatically. Use a `.dev.vars`
file **inside `server/`** (never commit it) for local-only values:

```
RESEND_API_KEY=re_...
FROM_EMAIL="Actora <hello@your-verified-domain.com>"
INQUIRY_TO_EMAIL=you@your-domain.com
ALLOWED_ORIGINS=http://localhost:3000
AUTO_REPLY=true
ADMIN_TOKEN=generate-a-long-random-string
DROPBOX_SIGN_API_KEY=...
```

Test the endpoint:

```bash
curl -i -X POST http://localhost:8787/api/inquiries \
  -H 'content-type: application/json' \
  -H 'origin: http://localhost:3000' \
  --data '{"kind":"contact","name":"Test Person","email":"test@example.com","message":"This is a test inquiry message.","consent":true,"elapsedMs":5000,"website":""}'
```

`elapsedMs: 5000` passes the timing check, so this exercises the email path.
With no `RESEND_API_KEY` you should receive a `503` and **no** success message —
that is the intended behaviour.

## Privacy

- Inquiry content is sent by email and is not persisted in KV.
- Rate-limit keys store only a SHA-256 hash of the connecting IP, for 15 minutes.
- Contract records store SHA-256 hashes of access tokens, never raw tokens.
- Logs must not include message bodies. Keep them that way.

## Contract flow

1. Create the agreement in the e-signature provider dashboard.
2. Take the provider's `signature_request_id`.
3. Register it with the status service:

```bash
curl -X POST https://<worker-host>/api/contracts/register \
  -H "authorization: Bearer $ADMIN_TOKEN" \
  -H 'content-type: application/json' \
  --data '{"providerRequestId":"<id>","clientEmail":"client@example.com","expiresAt":"2026-12-31T23:59:59Z"}'
```

The response contains a status `token`. Send it to the client **through a secure
channel**, alongside the provider's own signing email. The client can then check
status at `/contracts#signing`. The token alone grants status visibility, not
document access.

4. Point the provider webhook at
   `https://<worker-host>/api/webhooks/dropbox-sign` and make sure
   `DROPBOX_SIGN_API_KEY` matches the key that generated the event hash.

See `docs/INTEGRATIONS.md` for the full setup, including costs and security
notes.
