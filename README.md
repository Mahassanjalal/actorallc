# Actora LLC — software company website

A professional, dark-first website for **Actora LLC**, a software and
technology company in Austin, Texas. Built with React, TypeScript, Vite and
Tailwind, prerendered to real HTML for fast, indexable static hosting, with a
small serverless backend reference for inquiries and contract status.

> **Content status: preview.** Sample copy, sample case studies and placeholder
> contact addresses are shipped deliberately and labelled in the interface. See
> [What must be replaced before launch](#what-must-be-replaced-before-launch).

---

## Highlights

- **Professional and focused** — a clean hero, clear typography,
  structured layouts and purposeful motion. Motion is short, purposeful and
  disabled for `prefers-reduced-motion`.
- **Real static HTML** — every route is prerendered with unique metadata,
  canonical URLs, Open Graph tags and JSON-LD. Deep links work on GitHub Pages
  without SPA rewrites.
- **Publishing that stays reviewable** — insights are Markdown files in
  `content/insights`, compiled at build time. RSS, sitemap, reading time,
  categories and related articles are generated automatically.
- **Honest forms** — client and server validation, honeypot, timing check,
  rate limiting and clear failure states. Success is only shown after the API
  confirms the submission. When no endpoint is configured, the site says so.
- **Contracts done properly** — e-signature links are issued by a provider
  (Dropbox Sign by default). The site never collects signatures, never exposes a
  document directory, and only records provider-confirmed statuses.
- **Accessible by construction** — semantic landmarks, skip link, visible focus,
  field-level error messaging, keyboard-tested navigation and a reduced-motion
  path that keeps all content visible.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| UI | React 19 + TypeScript | Typed, componentised interface |
| Build | Vite 8 | Fast builds, first-class static output |
| Styling | Tailwind CSS v4 + design tokens | Consistent system, small CSS |
| Motion | Motion for React | Fine-grained interaction control |
| Icons | Lucide | Small, tree-shaken icon set |
| Routing | React Router 7 | Real routes for prerendering |
| Content | Markdown + YAML frontmatter (`marked`, `yaml`) | Reviewable publishing without a CMS |
| Backend | Cloudflare Worker reference (`server/`) | Validation, rate limits, email, webhook status |
| Tests | Vitest + Testing Library | Unit, component, SSR and worker tests |

No paid service is required to view the site. Email delivery and e-signature
features require credentials you provide.

## Quick start

Requires Node 22 or newer.

```bash
npm ci
npm run dev          # http://localhost:3000
```

Open the URL shown by Vite. The preview notice at the top explains that sample
content is in place.

```bash
npm run build        # client build → SSR build → prerender → dist/
npm run preview      # serve the production build locally
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server with HMR on port 3000 |
| `npm run build` | Production build, prerenders 18 routes + 404 |
| `npm run preview` | Serve `dist/` on port 4173 |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | App and config TypeScript projects |
| `npm test` | Vitest suite |
| `npm run verify:dist` | Check titles, canonicals, JSON-LD, links and output files |
| `npm run check` | Lint → typecheck → tests → build → verify output |

## Structure

```text
.
├─ .github/workflows/     CI and GitHub Pages deployment
├─ content/insights/      Markdown articles (frontmatter + body)
├─ docs/                  Content, deployment and integration guides
├─ public/                favicon.svg, og.png (static passthrough)
├─ scripts/prerender.mjs  Per-route HTML, sitemap, RSS, robots, 404
├─ server/                Cloudflare Worker: inquiries + contract status
├─ src/
│  ├─ config/site.ts      ← the file to edit for brand, contact, services
│  ├─ lib/                SEO, Markdown loader, validation, API client
│  ├─ components/         layout, cards, forms, sections, UI, visuals
│  ├─ pages/              one file per route
│  ├─ styles/index.css    tokens, base styles, reveal/prose systems
│  ├─ entry-server.tsx    SSR entry used by the prerender script
│  └─ main.tsx            hydration entry
├─ index.html             shell + reveal bootstrap + head marker
└─ vite.config.ts         base path, aliases, test config
```

## Configuration

Everything a non-developer is likely to change lives in
[`src/config/site.ts`](src/config/site.ts):

- brand name, legal name, wordmark, tagline, headline, description;
- contact emails, optional phone, social links, newsletter flag;
- software services, development process, values and case studies;
- legal dates, retention period and jurisdiction;
- integration provider names and public endpoint URLs;
- the preview-content notice.

Values marked `PLACEHOLDER` are stand-ins. The interface labels sample case
studies with a **Sample** chip and explains the preview notice in the header.
See [docs/CONTENT.md](docs/CONTENT.md) for the publishing workflow.

### Content and SEO

Each Markdown file in `content/insights` produces:

- a prerendered article at `/insights/<slug>/` with `BlogPosting` JSON-LD;
- a listing entry with category filter, search and reading time;
- an RSS item, sitemap entry, Open Graph and canonical metadata;
- related-article links based on category and tags.

Drafts (`draft: true`) are hidden in production builds and visible in
development.

### Environment variables

Copy [`.env.example`](.env.example) to `.env` for local use. Every `VITE_*`
value is **public** and embedded in the bundle.

| Variable | Example | Purpose |
| --- | --- | --- |
| `VITE_SITE_URL` | `https://actorallc.com` | Canonical origin (no trailing slash) |
| `VITE_BASE_PATH` | `/` or `/actorallc/` | Custom domain vs GitHub project site |
| `VITE_INQUIRY_ENDPOINT` | `https://api.actorallc.com` | Deployed inquiry API |
| `VITE_CONTRACT_API_ENDPOINT` | `https://api.actorallc.com` | Contract status API |

Never put `RESEND_API_KEY`, e-signature keys or `ADMIN_TOKEN` in a `VITE_*`
variable. Server secrets belong in the Worker (see
[docs/INTEGRATIONS.md](docs/INTEGRATIONS.md)).

## Forms and contracts

- **Contact / Start a project** validate in the browser and again on the server.
  The browser posts JSON to `${VITE_INQUIRY_ENDPOINT}/api/inquiries`; a success
  page appears only after the Worker returns a receipt. Without an endpoint, the
  form is visibly disabled in spirit and explains how to reach the company.
- **Contracts** are issued in the provider's dashboard. The Worker stores a
  hashed access token → status record and updates it from verified webhooks. The
  `/contracts` page offers a token-based status lookup and clearly states when
  the integration is not configured. No simulated signing exists anywhere in
  the codebase.
- **Spam and retention:** honeypot field, minimum submit time, hashed-IP rate
  limits (15-minute KV window), no inquiry bodies stored in KV, and email
  delivery through the provider.

Deployment for the Worker, provider accounts, secrets and costs:
[docs/INTEGRATIONS.md](docs/INTEGRATIONS.md).

## Deployment

The deploy workflow builds, tests and publishes `dist/` to GitHub Pages using
the official artifact flow.

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. Push to `main` (or run **Deploy to GitHub Pages** manually).
3. For a project site, no configuration is required — the workflow defaults to
   `https://<owner>.github.io` and base path `/<repository>/`.
4. For a custom domain, create repository variables:
   - `VITE_SITE_URL=https://your-domain.com`
   - `VITE_BASE_PATH=/`
   - `CUSTOM_DOMAIN=your-domain.com` (writes `dist/CNAME`)
   - then configure DNS and enable HTTPS.

Full steps, DNS records, troubleshooting and rollback:
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

### Assets and caching

Build assets are content-hashed. HTML is generated per route with a canonical
URL; no service worker, no runtime API dependency for rendering. Fonts are
self-hosted through Fontsource (no Google Fonts request). Social preview image:
`public/og.png` (1200×630).

## Testing and verification

What was run for this delivery:

| Check | Result |
| --- | --- |
| `npm run lint` | Passes |
| `npm run typecheck` | Passes |
| `npm test` | 57 tests across 9 files pass |
| `npm run build` | Succeeds; 18 routes + `404.html` prerendered |
| Sitemap / RSS / robots / `.nojekyll` | Generated in `dist/` |
| `npm run verify:dist` | 18 pages checked; all internal links and anchors resolve |
| Base-path build (`/actorallc/`) | Verified asset, link and canonical URLs |

The suite covers validation rules, Markdown loading, SEO/canonical/JSON-LD
output, every route's static rendering, hydration without mismatches, both
inquiry flows (success, validation failure, API failure), and the Worker's
server validation, rate limiting, webhook HMAC verification and token-only
status responses.

Lighthouse scores are **not claimed** here: they depend on the deployed host and
network profile. Run Lighthouse against the deployed preview and address any
regressions before launch. The production bundle is analysed during build; the
current main bundle warning is expected and can be split further if the
remaining content justifies it.

## Accessibility

WCAG 2.2 AA practices are designed in, not bolted on:

- semantic landmarks, one `h1` per page, ordered headings;
- skip link, visible `:focus-visible` rings, 44px minimum touch targets;
- mobile menu as a modal dialog with Escape, focus trap and focus restore;
- labelled fields, `aria-invalid`, `aria-describedby` errors, focus moved to the
  first problem, preserved input on failure;
- no forced intro video, no scroll hijacking, no custom cursor;
- reduced motion honoured in CSS, the hero, reveals, marquee and page changes;
- content remains in the HTML if JavaScript fails (4-second reveal failsafe).

## What must be replaced before launch

The repository intentionally contains no invented clients, awards, testimonials
or business history. To finalize:

1. **Brand copy** — tagline, positioning, hero support and about narrative in
   `src/config/site.ts` (currently marked as placeholder).
2. **Contact details** — `hello@`, `projects@`, `contracts@`, `privacy@`
   currently use the reserved `.example` domain. Add a real phone only if
   published.
3. **Services and process** — confirm the four placeholder services and the
   four-phase development process match what the company actually offers.
4. **Case studies** — replace the three `sample: true` projects with approved
   work, real context and verified results. Remove `sample` flags when done.
5. **Team** — add names, roles and approved bios to `site.team` or leave the
   section hidden.
6. **Insights** — replace the four sample essays (or keep them as real writing).
7. **Legal review** — Privacy Policy and Terms of Use are accurate to the current
   implementation but are not legal advice. Have counsel review them, including
   retention and jurisdiction.
8. **Social links** — add a `site.social` entry per platform (already rendered
   only when present).
9. **Server credentials** — Resend, Cloudflare KV, Dropbox Sign and admin token.
10. **Domain and DNS** — then disable the preview notice
    (`site.contentNotice.enabled = false`).

## Notes and limitations

- No analytics, advertising scripts or tracking cookies are included.
- Newsletter signup is hidden until an email platform is chosen.
- The signature provider is integrated as a documented interface, not a fake
  flow; without credentials the UI reports the integration as not configured.
- The `server/` Worker is a deployment reference and is not built or deployed by
  the frontend CI. It has its own instructions.
- The site is designed to be static. Adding a database or CMS is optional; the
  Markdown workflow is intentional and does not require one.

---

© Actora LLC. All rights reserved. Sample content is included solely to
demonstrate the design and is not a claim about the company.
