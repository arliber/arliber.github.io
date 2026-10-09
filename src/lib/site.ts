import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../site.config';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix an absolute site path with the deploy base (`/site`). */
export const url = (path = '/') => BASE + path;

export const domainOf = (href: string) => new URL(href).hostname.replace(/^www\./, '');

/** "09 OCT 2026" */
export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).toUpperCase();

/** "2026-10-09" for list columns */
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Minutes at 220 wpm, ignoring code fences and markdown punctuation. */
export function readingTime(body = '') {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`|\-:[\](){}]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220)) + ' min';
}

export async function getProjects() {
  const all = await getCollection('projects');
  return all.sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999) || a.data.title.localeCompare(b.data.title));
}

/** Newest first; undated drafts on top. Drafts only when SITE.showDrafts. */
export async function getPosts() {
  const all = await getCollection('writing', (p) => SITE.showDrafts || !p.data.draft);
  const t = (p: CollectionEntry<'writing'>) => p.data.date?.getTime() ?? Number.MAX_SAFE_INTEGER;
  return all.sort((a, b) => t(b) - t(a) || a.id.localeCompare(b.id));
}

export async function getLinks() {
  const all = await getCollection('reading');
  return all.sort((a, b) => b.data.saved.getTime() - a.data.saved.getTime());
}

export const postLabel = (p: CollectionEntry<'writing'>) =>
  p.data.draft || !p.data.date ? 'DRAFT' : isoDate(p.data.date);
