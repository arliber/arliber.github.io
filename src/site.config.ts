// Site-wide constants. Edit here, not in layouts.
export const SITE = {
  author: 'Arik',
  // Dashboard clock time zone (IANA name). Set to your own zone.
  timeZone: 'Asia/Jerusalem',
  github: 'https://github.com/Arlever',
  repo: 'https://github.com/arliber/site',
  branch: 'main',
  // Drafts are listed in `astro dev` but hidden from the production build.
  showDrafts: import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true',
};
