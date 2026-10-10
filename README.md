# Liber A.

Arik's public notebook of projects, writing and reading. It's a static [Astro](https://astro.build) site built from markdown and deployed to GitHub Pages.

```sh
npm install
npm run dev       # http://localhost:4321/  (drafts visible)
npm run build     # astro check + static build to dist/ (drafts hidden)
PUBLIC_SHOW_DRAFTS=true npm run build   # build including drafts
```

- Content: `src/content/{projects,writing,reading}` and `src/data/status.json`
- Design reference (V1, final): `design/` contains the handover spec, static mocks and screenshots
- Rules for AI agents maintaining the site: [`CLAUDE.md`](CLAUDE.md)

Fonts: IBM Plex Mono / Sans, self-hosted under the SIL Open Font License (`public/fonts/OFL.txt`).
