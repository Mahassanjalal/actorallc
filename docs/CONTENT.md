# Publishing guide

For anyone adding or editing content without needing to understand the code.
Everything here happens through GitHub — there is no separate admin panel.

## Where articles live

Each article is one Markdown file in `content/insights/`:

```
content/insights/designing-for-the-first-three-seconds.md
```

The filename becomes the URL unless a `slug` is supplied:
`/insights/designing-for-the-first-three-seconds/`.

To add an article, use **Add file → Create new file** in GitHub, paste the
template below, and open a pull request. The CI checks will run automatically.

## Article template

```markdown
---
title: "A clear, specific title"
slug: "a-clear-specific-title"
description: "One or two sentences used on the index page and in search results."
author: "Actora Studio"
date: "2026-10-23"
category: "Craft"
tags:
  - design
  - typography
seoTitle: "Optional search title — Actora"
seoDescription: "Optional search description, around 150–160 characters."
cover: ""
coverAlt: ""
featured: false
draft: false
---

Opening paragraph. This is shown slightly larger when the article opens.

## A section heading

Body copy. Standard Markdown works: **bold**, *italic*, [links](https://example.com),
lists, quotes, code and tables.

> Pull quotes render in the display serif.

- A list item
- Another list item
```

## Fields

| Field | Required | Notes |
| --- | --- | --- |
| `title` | Yes | The on-page headline |
| `slug` | Recommended | Lowercase words separated by hyphens; must be unique |
| `description` | Yes | 1–2 sentences; used on cards, RSS and social previews |
| `author` | Yes | A person or "Actora Studio" |
| `date` | Yes | `YYYY-MM-DD`; newest articles appear first |
| `category` | Yes | Use an existing category to group related articles |
| `tags` | Optional | Used for search and related articles |
| `seoTitle` | Optional | Defaults to `title — Actora Insights` |
| `seoDescription` | Optional | Defaults to `description` |
| `cover` | Optional | Absolute URL, or a path served from `public/` |
| `coverAlt` | If cover set | Describe the image for screen readers |
| `featured` | Optional | Highlights the article where a featured piece is used |
| `draft` | Optional | `true` hides it from production builds (visible locally) |

## Categories

Current categories come from the articles themselves: **Craft**,
**Engineering**, **Strategy** and **Operations**. Add a new one simply by using
it — the filter buttons update automatically. Keep the spelling consistent.

## Images

The site's artwork is generated (SVG), so no images are required.

If you add a photograph:

1. Prefer an absolute `https://` URL for `cover` in the frontmatter, or upload
   the file to `public/images/`.
2. For GitHub **project** pages the path must include the base path
   (`/repository-name/images/photo.jpg`). Absolute URLs avoid this issue.
3. Use descriptive `coverAlt` text. Do not put text inside images that is not
   also present in the article.

## Reading, SEO and feeds

Nothing else needs updating after publishing. The build automatically:

- calculates reading time;
- generates the article page, canonical URL, Open Graph tags and `BlogPosting`
  structured data;
- adds the article to the Insights index, the XML sitemap and `rss.xml`;
- links two related articles based on category and tags.

## Review and publication

1. Open a pull request. CI runs lint, typecheck, tests and a production build.
2. Ask for a review from the studio.
3. Once approved and merged to `main`, the deploy workflow publishes the site.

To unpublish an article without deleting the writing, set `draft: true`. To
remove it entirely, delete the file and open a pull request.

## Editing the studio pages

Homepage, About, Services, Work, Contact and legal copy live in
`src/config/site.ts` and the page files. For routine updates:

- **Contact details, tagline, social links, team:** `src/config/site.ts`.
- **Services and process:** the `services` and `process` arrays in the same file.
- **Case studies:** the `work` array. Remove `sample: true` only after the
  client has approved the published text and any results.
- **Legal dates and retention:** `site.legal`.

When the real content is in place, set `contentNotice.enabled` to `false` to
remove the preview banner. Also remove the `sample` flags and the "Sample essay"
note in `/src/pages/InsightArticle.tsx` if the essays are now published as
genuine writing.

## Before you publish

- [ ] No client name, quote, metric or award appears without written approval.
- [ ] Contact details are real mailboxes (not `.example`).
- [ ] Legal pages have been reviewed.
- [ ] The preview notice is off.
- [ ] Someone has read the page on a phone.
