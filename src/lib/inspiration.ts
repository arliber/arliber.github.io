import type { ImageMetadata } from 'astro';
import { getImage, inferRemoteSize } from 'astro:assets';
import pins from '../data/pins.json';

// Two sources, merged newest-first:
// - images dropped into src/assets/inspiration/, dated by a macOS "Screenshot YYYY-MM-DD at HH.MM.SS" name
//   (files without one sort last)
// - pins from SITE.pinterestBoard, saved to src/data/pins.json daily by scripts/sync-pins.mjs
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/inspiration/*.{png,jpg,jpeg,webp,gif,avif}', { eager: true });

type Source = { src: ImageMetadata | string; alt: string; date: number };

function localSources(): Source[] {
  return Object.entries(files).map(([path, mod]) => {
    const m = path.match(/(\d{4}-\d{2}-\d{2}) at (\d{2})\.(\d{2})\.(\d{2})/);
    return { src: mod.default, alt: '', date: m ? Date.parse(`${m[1]}T${m[2]}:${m[3]}:${m[4]}`) : 0 };
  });
}

function pinSources(): Source[] {
  return pins.map((p) => ({ src: p.image, alt: p.title, date: Date.parse(p.date) }));
}

/**
 * Newest first, with a ~720px webp thumbnail and a ≤2400px webp for the lightbox.
 * Images that fail to load (e.g. a pin deleted on Pinterest) are skipped with a warning.
 */
export async function getShots(limit = Infinity) {
  const sources = [...localSources(), ...pinSources()].sort((a, b) => b.date - a.date);
  const shots = await Promise.all(
    sources.map(async ({ src, alt }) => {
      try {
        return await shot(src, alt);
      } catch (e) {
        console.warn(`[inspiration] skipping ${src}: ${e}`);
      }
    }),
  );
  return shots.filter((s) => s !== undefined).slice(0, limit);
}

async function shot(src: Source['src'], alt: string) {
  const { width, height } = typeof src === 'string' ? await inferRemoteSize(src) : src;
  // Remote images need both dimensions, so scale height with width; never upscale.
  const at = (max: number) => {
    const w = Math.min(width, max);
    return getImage({ src, width: w, height: Math.round((height * w) / width), format: 'webp' });
  };
  const [thumb, full] = await Promise.all([at(720), at(2400)]);
  return { alt, thumb, full };
}
