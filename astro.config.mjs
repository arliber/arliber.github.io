// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkBlocks from './src/plugins/remark-blocks.mjs';
import rehypeBlocks from './src/plugins/rehype-blocks.mjs';

// Bundle only the shader effects the site uses: swap shaders' all-effects registry
// chunk for src/lib/shaders-registry.js. Fails the build if an upgrade renames it.
/** @returns {import('vite').Plugin} */
function slimShaders() {
  const stub = decodeURIComponent(new URL('./src/lib/shaders-registry.js', import.meta.url).pathname);
  let swapped = false;
  return {
    name: 'slim-shaders',
    enforce: 'pre',
    resolveId(id, importer) {
      if (importer?.includes('/node_modules/shaders/') && /\/shaderRegistry-[\w-]+\.js$/.test(id)) {
        swapped = true;
        return stub;
      }
    },
    buildEnd() {
      if (this.environment?.name === 'client' && !swapped) this.error('slim-shaders: registry chunk not found — update src/lib/shaders-registry.js for the new shaders version');
    },
  };
}

// User site (repo arliber/arliber.github.io), served from the domain root.
const base = '/';

export default defineConfig({
  site: 'https://arliber.github.io',
  base,
  trailingSlash: 'always',
  output: 'static',
  // Pinterest pins are downloaded and optimized at build time (src/lib/inspiration.ts).
  image: { domains: ['i.pinimg.com'] },
  vite: { plugins: [slimShaders()] },
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      remarkPlugins: [remarkDirective, [remarkBlocks, { base }]],
      rehypePlugins: [rehypeBlocks],
      smartypants: false,
    }),
  },
});
