// Adds new pins from the Pinterest board's RSS feed (latest ~25 pins) to src/data/pins.json.
// Pins are only ever added, so the list keeps growing past what the feed shows; delete an
// entry by hand to take it off the site. Run daily by .github/workflows/deploy.yml.
// Usage: node scripts/sync-pins.mjs
import { readFile, writeFile } from 'node:fs/promises';

const CONFIG = new URL('../src/site.config.ts', import.meta.url);
const OUT = new URL('../src/data/pins.json', import.meta.url);

const board = (await readFile(CONFIG, 'utf8')).match(/pinterestBoard:\s*'([^']+)'/)?.[1];
if (!board) throw new Error('pinterestBoard not found in src/site.config.ts');
const feed = board.replace(/\/?$/, '.rss');

const unescape = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

/** The feed links 236px thumbnails; prefer the original upload, else Pinterest's 736px size. */
async function largest(thumb) {
  const original = thumb.replace('/236x/', '/originals/');
  const ok = await fetch(original, { method: 'HEAD', signal: AbortSignal.timeout(10_000) }).then((r) => r.ok, () => false);
  return ok ? original : thumb.replace('/236x/', '/736x/');
}

const res = await fetch(feed, { headers: { 'user-agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15_000) });
if (!res.ok) throw new Error(`${feed}: HTTP ${res.status}`);
const xml = await res.text();

const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
  const field = (tag) => unescape(item.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1] ?? '').trim();
  const thumb = field('description').match(/<img src="(https:\/\/i\.pinimg\.com\/236x\/[^"]+)"/)?.[1];
  const date = new Date(field('pubDate'));
  return { url: field('guid') || field('link'), thumb, title: field('title'), date: isNaN(date) ? null : date.toISOString() };
});

let pins = [];
try { pins = JSON.parse(await readFile(OUT, 'utf8')); } catch {}
// Match on the pin link and on the image file, in case Pinterest re-encodes pin ids.
const file = (img) => img.split('/').pop();
const known = new Set(pins.flatMap((p) => [p.url, file(p.image)]));

// Pins without an image in the feed (videos, still-processing pins) are skipped; a later run picks them up.
const fresh = items.filter((i) => i.url && i.thumb && i.date && !known.has(i.url) && !known.has(file(i.thumb)));
for (const i of fresh) pins.push({ url: i.url, image: await largest(i.thumb), title: i.title, date: i.date });

pins.sort((a, b) => b.date.localeCompare(a.date));
await writeFile(OUT, JSON.stringify(pins, null, 2) + '\n');
console.log(`${fresh.length} new pin(s); ${pins.length} total`);
