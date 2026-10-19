import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

// Drop images into src/assets/inspiration/; they show newest-first by filename
// (macOS "Screenshot YYYY-MM-DD at …" names sort by date).
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/inspiration/*.{png,jpg,jpeg,webp,gif,avif}', { eager: true });

/** Newest first, with a ~720px webp thumbnail and a ≤2400px webp for the lightbox. */
export async function getShots(limit = Infinity) {
  const entries = Object.entries(files).sort(([a], [b]) => b.localeCompare(a)).slice(0, limit);
  return Promise.all(
    entries.map(async ([path, mod]) => {
      const src = mod.default;
      const [thumb, full] = await Promise.all([
        getImage({ src, width: Math.min(src.width, 720), format: 'webp' }),
        getImage({ src, width: Math.min(src.width, 2400), format: 'webp' }),
      ]);
      return { name: path.split('/').pop()!, thumb, full };
    }),
  );
}
