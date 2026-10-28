---
title: "Static-first is a design decision"
slug: "static-first-is-a-design-decision"
description: "Prerendering is often treated as an engineering preference. It changes what the design can promise."
author: "Actora Studio"
date: "2026-08-27"
category: "Engineering"
tags:
  - performance
  - architecture
  - accessibility
  - vite
seoTitle: "Static-first is a design decision — Actora"
seoDescription: "Why prerendering changes the design brief: real HTML, fewer dependencies, and performance budgets that are tested rather than claimed."
cover: ""
featured: false
draft: false
---

A marketing site is often the most public thing a company owns and the least tested. It is built in a hurry, shipped behind a CMS, and judged on screenshots. Choosing to prerender it is usually framed as a technical optimisation. In practice it changes the brief.

## Real HTML is an accessibility feature

A client-rendered page shows a blank document until a large JavaScript bundle has parsed, executed and fetched data. On a fast laptop with a warm cache, that is invisible. On a train, an older phone, a locked-down corporate browser or a screen reader announcing the page early, it is the whole experience.

Prerendering each route gives the visitor a complete document immediately: headings in order, links that work, text that can be selected and translated, and metadata that crawlers and social cards can read without waiting for a runtime. Hydration then adds interaction rather than delivering the content.

That is also why we avoid designs that depend on JavaScript to reveal the first screen. A scroll reveal should be an enhancement; it should never be the difference between reading and not reading.

## Performance budgets belong in the design review

"Fast" is not a value you add at the end. It is a set of constraints that need a decision while there is still time to change the layout:

- **Weight**: how many typefaces, how many visual layers, how much motion runtime.
- **Priority**: what loads first on a phone, and what can wait until it is needed.
- **Stability**: what reserves space, so the headline does not jump as artwork arrives.
- **Interactivity**: what must be live immediately, and what can hydrate later.

When those constraints are visible in the design review, the team makes different choices. A single decorative animation that requires a 90KB library is no longer a free flourish; it is a trade against the rest of the page.

## Fewer moving parts, longer life

Static output is durable. There is no server process to patch, no database to migrate, no cache to warm incorrectly. Deployments become an atomic set of files, and a rollback is a revert commit. For a small studio site, that reliability is worth more than a bespoke admin panel.

Content can still be edited by non-developers. Markdown files in the repository, reviewed through a pull request, are a publishing workflow with version history and an audit trail built in. When a browser-based editor is genuinely required, a Git-based CMS can add one without moving rendering to a server.

## What we still test

Prerendering is not a substitute for verification. Before a site ships we check:

1. Every route returns its own HTML document with a unique title, description and canonical URL.
2. Deep links work on the host — including the 404 fallback — with the correct base path.
3. Forms validate on the client and the server, and the success state only appears after confirmation.
4. The site is usable with a keyboard, with reduced motion, and with the JavaScript bundle deliberately blocked.
5. The production build is measured on a throttled connection rather than judged by its build time.

None of that is exotic. It is simply easier to promise when the architecture has fewer things that can fail.
