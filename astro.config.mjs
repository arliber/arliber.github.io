// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkBlocks from './src/plugins/remark-blocks.mjs';
import rehypeBlocks from './src/plugins/rehype-blocks.mjs';

// User site (repo arliber/arliber.github.io), served from the domain root.
const base = '/';

export default defineConfig({
  site: 'https://arliber.github.io',
  base,
  trailingSlash: 'always',
  output: 'static',
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      remarkPlugins: [remarkDirective, [remarkBlocks, { base }]],
      rehypePlugins: [rehypeBlocks],
      smartypants: false,
    }),
  },
});
