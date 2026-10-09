# Liber A. — build handover (V1)

You are building Arik's personal site: a static, markdown-driven notebook of **projects**, **writing** and **reading** (bookmarks with notes), hosted on **GitHub Pages** and maintained over time by AI agents.

The visual design is **final (V1)**. Your job is to reproduce it **exactly** — same markup structure, colors, type, spacing, ASCII art and behaviour — while turning the hard-coded content into markdown-driven pages.

---

## 0. What's in this package

```
HANDOVER.md            ← this file (spec + build plan)
mocks/                 ← THE visual source of truth: static HTML for every page, light + dark
  home-{light,dark}.html
  projects-{light,dark}.html
  writing-{light,dark}.html
  article-{light,dark}.html
  reading-{light,dark}.html
screenshots/           ← full-page PNGs of each mock at 1440px (desktop) and 390px (mobile, @2x)
source/                ← original design-canvas files (*.dc.html): template + renderVals() logic
fonts/                 ← self-hosted IBM Plex Mono/Sans woff2 + plex.css + OFL license
```

**How to use them**

1. Open `mocks/*.html` in a browser — they render offline, with the real fonts. Match them pixel-for-pixel at 1440px and 390px; the PNGs in `screenshots/` are the reference.
2. The mocks use inline styles because they were generated from a design tool. **Don't ship inline styles.** Lift them into a small stylesheet built on CSS custom properties (the tokens in §2), keeping every value identical.
3. `source/*.dc.html` shows where each value came from. Its `renderVals()` contains the theme tables, the exact data used in the mocks, and the logic for the live widgets (clock, ISO week, spinner, filters, search). Port that logic to vanilla JS.
4. Links between mocks already work (`home-light.html` → `projects-light.html` …), so you can click through the whole site.

---

## 1. Stack and hosting

- **Astro** (latest stable), static output (`output: 'static'`), **no UI framework**. Use `.astro` components and plain `<script>` tags for the few interactive bits.
- **Content collections** with zod schemas (§4), one markdown file per item.
- **Zero JavaScript by default.** Only these get client JS: the theme toggle, the dashboard clock and spinner, and Reading filters and search.
- **Fonts:** self-host from `fonts/` (copy to `public/fonts/`). No Google Fonts requests.
- **Deploy:** GitHub Pages via the official `withastro/action` workflow on push to `main`. Set `site` and `base` correctly; it's a user site if the repo is `<username>.github.io`, otherwise it's a project site with a base path. A custom domain via `public/CNAME` is optional — ask Arik.
- No analytics, no RSS, no cookies.

---

## 2. Design tokens

Typefaces:

- **IBM Plex Mono** at 400/500/600 is the "structure" face: title bar, labels, section heads, metadata, dashboard and ASCII art.
- **IBM Plex Sans** at 400/500/600 plus italic 400 is the reading face: headings and body.

Fallback stacks: `'IBM Plex Mono', ui-monospace, monospace` and `'IBM Plex Sans', 'Helvetica Neue', sans-serif`.

### Page themes

Selected by `[data-theme="light" | "dark"]` on `<html>`.

| token | light | dark | used for |
|---|---|---|---|
| `--bg` | `#F3F1EC` | `#101114` | page ground |
| `--ink` | `#15171C` | `#ECE9E2` | primary text, strong rules, inverted chips |
| `--body` | `#22252C` | `#D6D3CB` | article body text |
| `--sub` | `#3A3E47` | `#B9B6AE` | secondary text (ledes, summaries) |
| `--muted` | `#5A5F6B` | `#8E929C` | labels, metadata |
| `--line` | `rgba(21,23,28,.18)` | `rgba(236,233,226,.16)` | column rails, grid lines |
| `--line2` | `rgba(21,23,28,.10)` | `rgba(236,233,226,.09)` | row dividers |
| `--strong` | `#15171C` | `rgba(236,233,226,.55)` | section borders |
| `--panel` | `#ECE9E2` | `#17181C` | code blocks, callouts |
| `--hatch` | `rgba(21,23,28,.10)` | `rgba(236,233,226,.09)` | diagonal hatch bands and placeholders |
| `--accent` | `#2457C5` | `#7797DB` | links, banner, "All …" links, PROTOTYPE chip |
| `--signal` | `#C2410C` | `#D47A55` | ACTIVE chip, "Draft", arrows |
| `--note-bg` | `#F8EDBE` | `#2B2611` | personal-note paper |
| `--note-fold` | `#E2CF84` | `#4A401C` | folded corner |
| `--note-ink` | `#3B300A` | `#F0E2A8` | note text |
| `--note-sign` | `#7A5D00` | `#C9AE55` | "— A." signature |

The dark accents are the light ones mixed toward white: accent by 38%, signal by 30%.

### Dashboard panel

The panel is **inverted**: it is dark on the light page and light on the dark page.

| token | on light page | on dark page |
|---|---|---|
| `--p-bg` | `#15171C` | `#ECE9E2` |
| `--p-ink` | `#ECE9E2` | `#15171C` |
| `--p-muted` | `#9A9EA8` | `#5A5F6B` |
| `--p-dim` (empty bar) | `rgba(236,233,226,.22)` | `rgba(21,23,28,.25)` |
| `--p-line` | `rgba(236,233,226,.14)` | `rgba(21,23,28,.16)` |
| `--p-accent` | `#87A3DF` | `#2457C5` |
| `--p-signal` | `#D47A55` | `#C2410C` |
| `--p-ok` | `#5FD39A` | `#1F7A5C` |

### Status chips (projects)

- **ACTIVE:** filled `--signal`, with white text in light mode and `--bg` text in dark mode.
- **PROTOTYPE:** 1px `--accent` border with `--accent` text.
- **PLANNING:** 1px `--line` border with `--ink` text.

All chips are 11px mono, `letter-spacing: .06em`, with `3px 8px` padding.

### Layout rules

- The page is a **centered column**, `max-width: 1120px`, with 1px `--line` rails left and right that run the full page height.
- Outer gutter is `clamp(0px, 2vw, 16px)`; inner horizontal padding is `clamp(18px, 4vw, 32px)`.
- Square corners everywhere (no border radius).
- Grids draw 1px lines with the "gap: 1px on a `--line` background" technique. Cards have `flex: 1 1 300px` and wrap.
- **Section separation (home):** each section ends with a 1px `--strong` border, followed by a **40px band** filled with `repeating-linear-gradient(135deg, var(--hatch) 0 1px, transparent 1px 7px)`.
- **Section header:** an inverted number tag (`01`, ink background, bg text, 12px mono) followed by a terminal-style path (`~/projects`) in mono at `clamp(18px, 2.2vw, 22px)`, with an `--accent` "ALL … →" link on the right.
- Responsive type uses `clamp()` as in the mocks. There are no media queries for layout; everything wraps with flexbox.

---

## 3. Pages

Paths are suggestions; keep URLs short.

| route | mock | content |
|---|---|---|
| `/` | `home-*` | hero + dashboard, 6 latest projects, 4 latest posts, 4 latest links |
| `/projects/` | `projects-*` | all projects, card grid |
| `/projects/<slug>/` | *(reuse the article layout)* | a project page is an article with a project header |
| `/writing/` | `writing-*` | all posts, newest first (drafts hidden in prod) |
| `/writing/<slug>/` | `article-*` | post |
| `/reading/` | `reading-*` | all links, with tag filters and search |

### Shared chrome

- **Title bar.** Three 10px squares (outline, outline, filled), then the path `arik@site: ~/<section>/<file>`. The `~` and each path segment link up the tree.
  - On the right is the theme toggle button: label `◐ dark` in light mode and `◑ light` in dark mode, uppercase, with a 1px ink border.
  - **There is no nav menu.** Navigation happens through "All … →" links, the path in the title bar, and breadcrumbs.
- **Footer.** `░░░░░░ © <year> Arik · built from markdown` on the left, `github ↗` (https://github.com/Arlever) on the right. The article footer also has an `edit this page (.md)` link to the file on GitHub.

### Home hero

- **Left column** (flexible):
  - The `LIBER A.` ASCII banner in ANSI-Shadow letters, `--accent` color, `font-size: clamp(6.5px, 1.25vw, 14px)`, `line-height: 1.05`. Copy the exact `<pre>` from `mocks/home-light.html`.
  - Below it, the h1 at `clamp(26px, 3.2vw, 36px)` and a one-line lede.
- **Right column:** the **status.live dashboard**. It fills the whole column edge to edge with no padding around it, stretches to full hero height, and becomes full-width under the intro on mobile. Rows, separated by `--p-line`:
  1. Header row: `┌ status.live` on the left; on the right, a blinking `--p-ok` square and `ONLINE`.
  2. Clock row: a live clock `HH:MM:SS` (22px), and on the right `FRI 09 OCT` / `WK 41` (ISO week).
  3. `THIS WEEK` with a done/total count. Each goal is `[x]` or `[ ]`; done goals use muted text with a strike-through. Below the goals is a 24-character progress bar (`▓` in `--p-accent`, `░` in `--p-dim`).
  4. `AGENTS`: one row per agent, each with an icon, a name (92px column) and its task in muted text, ellipsised.
     - Icons: running is the braille spinner `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` in `--p-signal`, active is `●` in `--p-ok`, idle is `○` in muted.
  5. The bottom row is pinned to the bottom with `margin-top: auto`: `$ tail -f now.md` and a blinking 8×14 block cursor.

### Reading notes ("folded paper")

- A note is a box with `--note-bg` background, padding `12px 34px 12px 16px`, `max-width: 640px`, and `clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)`.
- An absolutely positioned 18×18 `--note-fold` triangle sits in the top-right corner, with `clip-path: polygon(0 0, 0 100%, 100% 100%)`.
- The text is 15px italic Plex Sans in `--note-ink`, followed by ` — A.` in 11px mono `--note-sign`.
- There is **no label**. Render the note only when a link has one.

### Article

Match `article-*` exactly:

- Centered head: breadcrumb, h1 at `clamp(34px, 5vw, 56px)`, and a dek.
- A 4-cell meta strip: AUTHOR, PUBLISHED, READING TIME, PROJECT.
- A two-column body:
  - **Left sidebar:** a `TREE` table of contents with `└` items generated from h2s, then a reading-progress bar (`▓` accent / `░` muted, 20 chars) with `NN% · PRESS ↑ / ↓ TO SCROLL`. There are **no share links**.
  - **Main column:** `max-width: 680px`.
- Markdown element styles:
  - **h2:** mono, 14px, uppercase, auto-numbered `01`, `02` …, followed by a 1px rule filling the rest of the line.
  - **Figures:** a caption that begins `FIG A`, `FIG B` … in bold.
  - **Code blocks:** a header bar showing `CODE  <LANG>` and a `COPY` button, with the code on a `--panel` background.
  - **Tables:** wrapped in a box, with a mono uppercase header row.
  - **Callout:** `▲ NOTE` in `--signal` on `--panel`, with a 1px `--ink` border. Implement it as a remark/rehype directive, e.g. `:::note`.
- A **Related** list and the footer sit below the body.

---

## 4. Content model (`src/content/`)

```ts
// projects/<slug>.md
title: string
status: 'active' | 'prototype' | 'planning'
summary: string            // one sentence, shown on cards
image?: string             // photo/render; falls back to hatched "[ PHOTO / RENDER ]" box
order?: number
// body = project write-up (rendered with the article layout)

// writing/<slug>.md
title: string
dek: string
date?: date                // absent + draft:true → shows "DRAFT"
draft: boolean
tags?: string[]
project?: reference('projects')
// reading time computed at build time

// reading/<yyyy>/<slug>.md
url: string
title: string
description: string        // one line
tag: 'agents' | 'ml' | 'design' | 'tools' | 'maps' | 'work'   // extendable
saved: date
note?: string              // Arik's personal note → folded-paper block
```

**Dashboard data:** `src/data/status.json`, updated by agents. The clock and week are computed client-side.

```json
{
  "goals": [{ "text": "print the gimbal ring", "done": false }],
  "agents": [{ "name": "site-agent", "state": "running|active|idle", "task": "filing new links" }],
  "updated": "2026-10-10T08:00:00Z"
}
```

Use the data in `source/Main.dc.html` → `renderVals()` to seed real content files. It covers the 6 projects, 4 draft posts, 8 links (3 with notes), goals and agents. Any bracketed placeholders such as `[DATE]` or `[TIME]` stay as TODOs for Arik.

---

## 5. Client behaviour

Use vanilla JS, kept small, with each piece in its own `<script>`.

1. **Theme**
   - Before first paint, an inline `<head>` script sets `data-theme` from `localStorage.theme`, falling back to `prefers-color-scheme`.
   - The toggle flips the theme, stores it, and updates the label and `aria-pressed`.
   - Wrap `localStorage` access in try/catch.
2. **Dashboard clock and spinner**
   - A `setInterval(1000)` updates the clock and ISO week (`isoWeek()` in `source/Main.dc.html`) and advances the spinner frame.
   - Time zone: Arik will set this in a site config constant. Format with `Intl.DateTimeFormat('en-GB', { timeZone })`.
   - Respect `prefers-reduced-motion`: no blinking or spinning, but the clock still updates.
3. **Reading filters and search**
   - Tag buttons (`*` means all) and a `grep` search box filter the list in place. Search matches title, description, domain and note, case-insensitively.
   - The count line reads `N items` or `N items matching "q"`.
   - Filter by toggling `hidden` on server-rendered items, so nothing is built in JS.
   - Sync the state to the URL (`?tag=ml&q=esp`).
4. **Article TOC and progress:** highlight the current section in `--accent` and update the `▓░` bar and percentage on scroll.
5. **Code copy button:** copy to the clipboard, then show `COPIED` for 1.5 seconds.

---

## 6. Agent operating rules

Put these in the repo's `CLAUDE.md`.

- Content lives only in `src/content/**` and `src/data/status.json`. Agents never edit layouts or styles unless asked.
- Agents **may commit directly** for:
  - new `reading/` entries without a `note`
  - `status.json` updates
  - typo fixes
- Agents **open a PR for Arik's review** for:
  - new or changed `writing/` or `projects/` content
  - anything adding or changing a `note`, which is Arik's voice
  - any deletion
- Never write anything private or work-confidential into `status.json` or content files. The site is public.
- Every commit must pass `npm run build` and the schema validation.

---

## 7. Build checklist

1. Scaffold Astro, add the fonts and the global token stylesheet (§2). Put the theme script in `<head>`.
2. Build the shared layout: rails, title bar, footer and section header components.
3. Build the pages in this order, comparing each against its mock and screenshot at 1440 and 390, in light and dark: Home → Projects → Writing → Article → Reading.
4. Add content collections and schemas, then seed content from the design data.
5. Add the client scripts (§5).
6. Run checks: Lighthouse accessibility ≥ 95, no horizontal scroll at 390px, keyboard focus visible, and contrast as in the tokens.
7. Set up the GitHub Actions workflow and enable Pages (Settings → Pages → Source: GitHub Actions), then verify the live URL.
8. Write the `CLAUDE.md` agent rules (§6) and a short README.
