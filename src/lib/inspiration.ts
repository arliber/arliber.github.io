import type { ImageMetadata } from 'astro';
import { getImage, inferRemoteSize } from 'astro:assets';
import { SITE } from '../site.config';

// Two sources, merged newest-first:
// - images dropped into src/assets/inspiration/, dated by a macOS "Screenshot YYYY-MM-DD at HH.MM.SS" name
//   (files without one sort last)
// - pins on SITE.pinterestBoard, read from the board's RSS feed (latest ~25 pins) at build time
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/inspiration/*.{png,jpg,jpeg,webp,gif,avif}', { eager: true });

type Source = { src: ImageMetadata | string; alt: string; date: number };

function localSources(): Source[] {
  return Object.entries(files).map(([path, mod]) => {
    const m = path.match(/(\d{4}-\d{2}-\d{2}) at (\d{2})\.(\d{2})\.(\d{2})/);
    return { src: mod.default, alt: '', date: m ? Date.parse(`${m[1]}T${m[2]}:${m[3]}:${m[4]}`) : 0 };
  });
}

const unescape = (s: string) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

/** The feed links 236px thumbnails; prefer the original upload, else Pinterest's 736px size. */
async function largest(thumb: string) {
  const original = thumb.replace('/236x/', '/originals/');
  const ok = await fetch(original, { method: 'HEAD', signal: AbortSignal.timeout(10_000) }).then((r) => r.ok, () => false);
  return ok ? original : thumb.replace('/236x/', '/736x/');
}

let pins: Promise<Source[]> | undefined;

/** Fetched once per build. A failed fetch logs and yields no pins, so the build still succeeds. */
function pinSources() {
  pins ??= (async () => {
    const feed = SITE.pinterestBoard.replace(/\/?$/, '.rss');
    try {
      const res = await fetch(feed, { headers: { 'user-agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
        const field = (tag: string) => unescape(item.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1] ?? '').trim();
        const img = field('description').match(/<img src="(https:\/\/i\.pinimg\.com\/236x\/[^"]+)"/)?.[1];
        return { img, alt: field('title'), date: Date.parse(field('pubDate')) || 0 };
      });
      // Pins without an image in the feed (videos, still-processing pins) are skipped.
      return await Promise.all(
        items.filter((i) => i.img).map(async (i) => ({ src: await largest(i.img!), alt: i.alt, date: i.date })),
      );
    } catch (e) {
      console.warn(`[inspiration] skipping Pinterest pins (${feed}): ${e}`);
      return [];
    }
  })();
  return pins;
}

/** Newest first, with a ~720px webp thumbnail and a ≤2400px webp for the lightbox. */
export async function getShots(limit = Infinity) {
  const sources = [...localSources(), ...(await pinSources())].sort((a, b) => b.date - a.date).slice(0, limit);
  return Promise.all(
    sources.map(async ({ src, alt }) => {
      const { width, height } = typeof src === 'string' ? await inferRemoteSize(src) : src;
      // Remote images need both dimensions, so scale height with width; never upscale.
      const at = (max: number) => {
        const w = Math.min(width, max);
        return getImage({ src, width: w, height: Math.round((height * w) / width), format: 'webp' });
      };
      const [thumb, full] = await Promise.all([at(720), at(2400)]);
      return { alt, thumb, full };
    }),
  );
}
