// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// rehype 插件：为 Markdown 正文图片自动注入 loading="lazy"
function rehypeLazyImages() {
  /** @param {any} tree */
  return (tree) => {
    /** @param {any} node */
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'img') {
        if (!node.properties) node.properties = {};
        // 首图不懒加载（LCP），其余懒加载
        if (!node.properties.loading) {
          node.properties.loading = 'lazy';
        }
        if (!node.properties.decoding) {
          node.properties.decoding = 'async';
        }
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    }
    visit(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://g-dxw.github.io',
  integrations: [mdx(), sitemap()],
  trailingSlash: "always",
  server: {
    host: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
    rehypePlugins: [rehypeLazyImages],
  },
});