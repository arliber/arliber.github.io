# site — Arik's public notebook

Astro static site (projects, writing, reading), deployed to GitHub Pages from `main`.
Live: https://arliber.github.io/site/ · Design spec: `design/HANDOVER.md` · Mocks: `design/mocks/`.

## Where things live

- `src/content/projects/<slug>.md` — project cards + project pages
- `src/content/writing/<slug>.md` — posts (`draft: true` hides it from the production build)
- `src/content/reading/<yyyy>/<slug>.md` — saved links (articles, books, podcasts, videos); optional `note` renders as the folded-paper note
- `public/img/` — images. Strip EXIF/GPS from phone photos before committing; reference them as `/img/...` in frontmatter and `/site/img/...` in markdown bodies
- `src/data/status.json` — the home-page `status.live` dashboard (goals + agents)
- Schemas: `src/content.config.ts`. Site constants (time zone, links): `src/site.config.ts`.

Markdown extras for writing/projects: `:::note … :::` callout, and
`::figure[Caption]{src="/site/…" alt="…"}` or `::figure[Caption]{placeholder="PHOTO — …"}`.
`## Headings` are auto-numbered and feed the article's TREE.

## Agent operating rules

- Content lives only in `src/content/**` and `src/data/status.json`. Never edit layouts, components or styles unless Arik asks.
- **Commit directly to `main`** only for:
  - new `reading/` entries **without** a `note`
  - `status.json` updates
  - typo fixes
- **Open a PR for Arik's review** for:
  - new or changed `writing/` or `projects/` content
  - anything adding or changing a `note` (that's Arik's voice)
  - any deletion
- The site is public. Never write anything private or work-confidential into `status.json` or content files.
- Every commit must pass `npm run build` (runs `astro check` + content-schema validation) before pushing.
- Leave bracketed placeholders like `[DATE]`, `[TIME]`, `[PART]` for Arik; don't invent facts to fill them.

## Content templates

```md
<!-- src/content/reading/2026/<slug>.md -->
---
url: https://example.com/post
type: article      # article (default) | book | podcast | video — picks the pixel icon
title: "Title as published"
description: "One line on what it is."
tag: agents        # agents | ml | design | tools | hardware | space | science | maps | work (READING_TAGS in src/content.config.ts)
saved: 2026-10-10
---
```

```json
// src/data/status.json — agents[].state: running | active | idle
{ "goals": [{ "text": "…", "done": false }], "agents": [{ "name": "site-agent", "state": "running", "task": "…" }], "updated": "2026-10-10T08:00:00Z" }
```
