# Deployment

The site is a static build deployed to GitHub Pages by GitHub Actions. The
optional API in `server/` is deployed separately to Cloudflare Workers.

## 1. One-time GitHub Pages setup

1. Repository **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
   Do not select "Deploy from a branch".
3. Repository **Settings → Actions → General → Workflow permissions**:
   allow read/write for workflows if your organisation restricts it, and allow
   GitHub Actions to create deployments.
4. Confirm the `github-pages` environment exists (created automatically on the
   first deployment). Add protection rules if you want an approval gate.

## 2. What the workflow does

`.github/workflows/deploy.yml` runs on every push to `main` and on manual
dispatch:

1. `npm ci`
2. lint, typecheck and tests (the deployment is blocked if any fail)
3. `npm run build` — client build, SSR build, then the prerender script
4. writes a `CNAME` file if a custom domain variable is set
5. uploads `dist/` with `actions/upload-pages-artifact`
6. deploys with `actions/deploy-pages`

Actions are pinned to full commit SHAs. `dist/` contains only public build
output — no secrets, source maps or dependencies.

## 3. Repository variables

Configure at **Settings → Secrets and variables → Actions → Variables**.

| Variable | Project site default | Custom domain |
| --- | --- | --- |
| `VITE_SITE_URL` | `https://<owner>.github.io` | `https://your-domain.com` |
| `VITE_BASE_PATH` | `/<repository>/` | `/` |
| `CUSTOM_DOMAIN` | *(unset)* | `your-domain.com` |
| `VITE_INQUIRY_ENDPOINT` | optional API origin | optional API origin |
| `VITE_CONTRACT_API_ENDPOINT` | optional API origin | optional API origin |

The workflow falls back to the project-site defaults, so a first deployment
works without any variables.

`VITE_SITE_URL` has **no trailing slash** and does **not** include the base
path; the prerender script appends the base path when it writes canonicals,
sitemap URLs and RSS links.

## 4. Custom domain and HTTPS

1. In **Settings → Pages → Custom domain**, enter the apex domain
   (`actorallc.com`) and save. This writes the domain to the repository settings
   and the workflow writes `dist/CNAME` on the next build.
2. At your DNS provider, add GitHub Pages records. Verify the current values in
   GitHub's documentation ("Managing a custom domain for your GitHub Pages
   site") before saving, as they can change.

   Apex (`@`) A records, typically:

   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   Apex AAAA records, typically:

   ```
   2606:50c0:8000::153
   2606:50c0:8001::153
   2606:50c0:8002::153
   2606:50c0:8003::153
   ```

   `www` CNAME → `<owner>.github.io`

3. Wait for DNS propagation, then enable **Enforce HTTPS** in Pages settings.
   Certificate issuance can take up to 24 hours.
4. Set `VITE_SITE_URL=https://actorallc.com`, `VITE_BASE_PATH=/`, and
   `CUSTOM_DOMAIN=actorallc.com`, then re-run the deployment.
5. Open `https://actorallc.com/robots.txt` and confirm the sitemap URL uses the
   custom domain.

Do not set `VITE_BASE_PATH=/` while still serving from
`https://<owner>.github.io/<repository>/` — assets will 404.

## 5. Local production check

```bash
npm ci
npm run build
npm run preview   # http://localhost:4173
```

For an exact base-path simulation:

```bash
VITE_BASE_PATH=/actorallc/ VITE_SITE_URL=https://example.github.io npm run build
npx serve dist     # then visit /actorallc/
```

Inspect `dist/index.html`: the `<title>`, canonical URL and JSON-LD must use the
intended domain. Check `dist/sitemap.xml`, `dist/rss.xml` and `dist/404.html`
exist. `dist/.nojekyll` must also be present.

## 6. Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Blank page, console shows failed module requests | Base path mismatch. Set `VITE_BASE_PATH=/<repository>/` (project site) or `/` (custom domain), rebuild and redeploy. |
| Navigating to `/about` gives 404 | Pages is serving from a branch instead of Actions, or the deploy artifact is stale. Confirm Source = GitHub Actions and that `dist/about/index.html` was uploaded. |
| CSS or JS loads but images/icons do not | Hard refresh after deploy; then check the network tab for `/assets/…` versus `/<repo>/assets/…`. |
| "Get Pages site failed" in Actions | Pages is not enabled for the repository, or the workflow lacks `pages: write` / `id-token: write`. |
| Deployment job waits indefinitely | A `github-pages` environment protection rule requires approval. Approve it in the Actions run. |
| Custom domain resets after deploy | The `CUSTOM_DOMAIN` variable is empty and the repository Pages setting was cleared. Set the variable so `dist/CNAME` is regenerated. |
| Site uses old content | GitHub Pages caches HTML briefly. Re-run the deployment; verify the new commit SHA in the run summary. |
| `404.html` loads instead of the page | The route does not exist in `getStaticRoutes()` — add the route and rebuild. |
| Forms return 503 | The Worker has no email credentials, or no `VITE_INQUIRY_ENDPOINT` was set. See [INTEGRATIONS.md](INTEGRATIONS.md). |

Use **Actions → Deploy to GitHub Pages → Re-run all jobs** to redeploy the same
commit.

## 7. Rollback

- **Content or code:** revert the offending commit on `main`; the workflow
  redeploys automatically.
- **Deployment only:** select a previous successful run and re-run its deploy
  job. The artifact is tied to that commit.
- **Feature off:** use a pull request to disable the feature (for example set
  `contentNotice.enabled` or hide a section) rather than editing production
  files in place.

## 8. Caching and headers

GitHub Pages controls response headers; custom header files are not supported.
The build uses content-hashed asset filenames, so long-lived caching is safe.
HTML is short-lived at the edge. If stricter cache control, HSTS or CSP headers
are required, put a CDN (for example Cloudflare) in front of the site and manage
headers there — this is optional and not configured in the repository.

## 9. Backend deployment

The contact form and contract status endpoints live in `server/` and deploy
independently:

```bash
npx wrangler deploy --config server/wrangler.toml
```

Then set the Worker's public URL as `VITE_INQUIRY_ENDPOINT` and
`VITE_CONTRACT_API_ENDPOINT`, and rebuild the site. Full instructions:
[INTEGRATIONS.md](INTEGRATIONS.md).

Never commit provider keys. GitHub Actions only needs the public `VITE_*`
variables; server secrets live in Cloudflare.
