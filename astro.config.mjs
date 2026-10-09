// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkBlocks from './src/plugins/remark-blocks.mjs';
import rehypeBlocks from './src/plugins/rehype-blocks.mjs';

export default defineConfig({
  site: 'https://arliber.github.io',
  base: '/site',
  trailingSlash: 'always',
  output: 'static',
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      remarkPlugins: [remarkDirective, remarkBlocks],
      rehypePlugins: [rehypeBlocks],
      smartypants: false,
    }),
  },
});
