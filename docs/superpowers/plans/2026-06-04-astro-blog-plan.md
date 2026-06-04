# Astro 个人博客系统实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建基于 Astro + Tailwind CSS 的现代个人博客，支持图文混合内容、暗色模式、Pagefind 搜索、RSS，通过 GitHub Actions 部署到 Vercel。

**Architecture:** Astro 静态站点生成（SSG），Content Collections 管理 Markdown 文章，Pagefind 提供客户端搜索索引，GitHub Actions 触发 Vercel 部署。

**Tech Stack:** Astro v6, Tailwind CSS v4, TypeScript, Pagefind, Vercel, GitHub Actions

---

## Phase 1: 项目初始化

### Task 1: 创建 Astro 项目

**Files:**
- Create: 整个项目骨架（`npm create astro@latest`）
- Modify: `astro.config.ts`、`package.json`

- [ ] **Step 1: 使用 Astro 博客模板创建项目**

```bash
npm create astro@latest . -- --template blog --no-install
```

- [ ] **Step 2: 安装依赖**

```bash
npm install
```

- [ ] **Step 3: 安装额外依赖（Tailwind、RSS、Sitemap）**

```bash
npx astro add tailwind
npx astro add sitemap
npm install @astrojs/rss pagefind
```

- [ ] **Step 4: 初始化 Git 仓库**

```bash
git init
git add -A
git commit -m "feat: scaffold Astro blog project from official template"
```

---

## Phase 2: 样式系统

### Task 2: 配置 Tailwind CSS 和设计令牌

**Files:**
- Modify: `tailwind.config.ts`（或 `astro.config.ts` 中配置 Tailwind）
- Modify: `src/styles/global.css`

- [ ] **Step 1: 删除模板默认样式，写入自定义 CSS 变量和 Tailwind 指令**

在 `src/styles/global.css` 写入：

```css
@import "tailwindcss";

@theme {
  /* 亮色模式 */
  --color-bg: #fafaf8;
  --color-surface: #ffffff;
  --color-text: #2d2d2a;
  --color-text-muted: #6b6b65;
  --color-accent: #e87b35;
  --color-accent-hover: #d0651f;
  --color-code-bg: #f4f4f2;
  --color-border: #e5e5df;

  /* 暗色模式 */
  --color-bg-dark: #111110;
  --color-surface-dark: #1a1a19;
  --color-text-dark: #e0e0dd;
  --color-text-muted-dark: #99998f;
  --color-accent-dark: #f0984a;
  --color-accent-hover-dark: #e87b35;
  --color-code-bg-dark: #0d0d0c;
  --color-border-dark: #2a2a27;
}

/* 全局过渡 */
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}

body {
  font-family: var(--font-sans);
}

/* prose 样式覆盖（文章详情用） */

.prose img {
  border-radius: 0.75rem;
}

/* 全宽图片 */
.prose .full-width-img {
  width: 100vw;
  max-width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

/* 毛玻璃导航 */
.nav-blur {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

### Task 3: 配置暗色模式切换 hooks

**Files:**
- Create: `src/utils/theme.ts`

- [ ] **Step 1: 创建主题切换工具函数**

```typescript
export function getThemePreference(): 'dark' | 'light' {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function setThemePreference(theme: 'dark' | 'light') {
  localStorage.setItem('theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function toggleTheme(): 'dark' | 'light' {
  const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  setThemePreference(next);
  return next;
}
```

---

## Phase 3: 组件

### Task 4: 创建 Base 布局

**Files:**
- Modify 或 Create: `src/layouts/Base.astro`

- [ ] **Step 1: 编写 Base 布局组件**

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

export interface Props {
  title: string;
  description: string;
  image?: string;
}

const { title, description, image } = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    {image && <meta property="og:image" content={image} />}

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />

    <title>{title}</title>

    <!-- 防止暗色模式闪白 -->
    <script is:inline>
      (function () {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      })();
    </script>
  </head>
  <body class="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)] min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### Task 5: 创建 Header 组件

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/ThemeToggle.astro`

- [ ] **Step 1: 创建 ThemeToggle 组件**

```astro
<button
  id="theme-toggle"
  type="button"
  class="p-2 rounded-lg hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-dark)] transition-colors cursor-pointer"
  aria-label="切换暗色模式"
>
  <!-- 太阳图标（暗色模式显示） -->
  <svg class="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
  <!-- 月亮图标（亮色模式显示） -->
  <svg class="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
</button>

<script>
  import { toggleTheme } from '../utils/theme';

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    toggleTheme();
  });
</script>
```

- [ ] **Step 2: 创建 Header 组件**

```astro
---
import ThemeToggle from './ThemeToggle.astro';
---

<header class="nav-blur sticky top-0 z-50 bg-[var(--color-bg)]/80 dark:bg-[var(--color-bg-dark)]/80 border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
  <nav class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
    <a href="/" class="text-xl font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors no-underline">
      我的博客
    </a>
    <div class="flex items-center gap-4 sm:gap-6">
      <a href="/" class="text-sm font-medium text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] hover:text-[var(--color-text)] dark:hover:text-[var(--color-text-dark)] transition-colors no-underline">首页</a>
      <a href="/blog" class="text-sm font-medium text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] hover:text-[var(--color-text)] dark:hover:text-[var(--color-text-dark)] transition-colors no-underline">文章</a>
      <a href="/about" class="text-sm font-medium text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] hover:text-[var(--color-text)] dark:hover:text-[var(--color-text-dark)] transition-colors no-underline">关于</a>
      <ThemeToggle />
    </div>
  </nav>
</header>
```

### Task 6: 创建 Footer 组件

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: 编写 Footer 组件**

```astro
<footer class="border-t border-[var(--color-border)] dark:border-[var(--color-border-dark)] mt-auto">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
    <p class="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
      &copy; {new Date().getFullYear()} 我的博客 &mdash; Built with Astro
    </p>
    <div class="flex items-center gap-4">
      <a href="/rss.xml" class="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] hover:text-[var(--color-accent)] transition-colors no-underline">
        RSS
      </a>
    </div>
  </div>
</footer>
```

### Task 7: 创建 TagBadge 组件

**Files:**
- Create: `src/components/TagBadge.astro`

- [ ] **Step 1: 编写 TagBadge 组件**

```astro
---
export interface Props {
  tag: string;
}

const { tag } = Astro.props;
---

<a
  href={`/blog/tag/${tag}`}
  class="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-code-bg)] dark:bg-[var(--color-code-bg-dark)] text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] hover:bg-[var(--color-accent)] hover:text-white dark:hover:bg-[var(--color-accent-dark)] dark:hover:text-black transition-colors no-underline"
>
  #{tag}
</a>
```

### Task 8: 创建 PostCard 组件

**Files:**
- Create: `src/components/PostCard.astro`

- [ ] **Step 1: 编写 PostCard 组件**

```astro
---
import type { CollectionEntry } from 'astro:content';
import TagBadge from './TagBadge.astro';

export interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;
const { title, date, cover, tags = [], summary } = post.data;
const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<article class="group bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] rounded-2xl overflow-hidden border border-[var(--color-border)] dark:border-[var(--color-border-dark)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
  <a href={`/blog/${post.slug}`} class="block no-underline">
    {cover && (
      <div class="aspect-[16/9] overflow-hidden">
        <img
          src={cover}
          alt={title}
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
    )}
    <div class="p-5 sm:p-6">
      <time class="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]" datetime={date.toISOString()}>
        {formattedDate}
      </time>
      <h2 class="mt-2 text-lg sm:text-xl font-semibold text-[var(--color-text)] dark:text-[var(--color-text-dark)] group-hover:text-[var(--color-accent)] dark:group-hover:text-[var(--color-accent-dark)] transition-colors line-clamp-2">
        {title}
      </h2>
      {summary && (
        <p class="mt-2 text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] line-clamp-3">
          {summary}
        </p>
      )}
      {tags.length > 0 && (
        <div class="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => <TagBadge tag={tag} />)}
        </div>
      )}
    </div>
  </a>
</article>
```

### Task 9: 创建 PostGrid 组件

**Files:**
- Create: `src/components/PostGrid.astro`

- [ ] **Step 1: 编写 PostGrid 组件**

```astro
---
import type { CollectionEntry } from 'astro:content';
import PostCard from './PostCard.astro';

export interface Props {
  posts: CollectionEntry<'blog'>[];
}

const { posts } = Astro.props;
---

{posts.length > 0 ? (
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {posts.map((post) => <PostCard post={post} />)}
  </div>
) : (
  <div class="text-center py-16">
    <p class="text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">暂无文章</p>
  </div>
)}
```

### Task 10: 创建 ImageViewer 组件（Lightbox）

**Files:**
- Create: `src/components/ImageViewer.astro`

- [ ] **Step 1: 编写 ImageViewer 组件**

```astro
<div
  id="image-viewer"
  class="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300"
  role="dialog"
  aria-modal="true"
  aria-label="图片查看器"
>
  <button
    id="image-viewer-close"
    class="absolute top-4 right-4 p-3 text-white/80 hover:text-white transition-colors cursor-pointer z-10"
    aria-label="关闭"
  >
    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
  <img id="image-viewer-img" class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform duration-200" src="" alt="" />
</div>

<script>
  const viewer = document.getElementById('image-viewer')!;
  const img = document.getElementById('image-viewer-img') as HTMLImageElement;
  const closeBtn = document.getElementById('image-viewer-close')!;

  function openViewer(src: string, alt: string) {
    img.src = src;
    img.alt = alt;
    viewer.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  }

  function closeViewer() {
    viewer.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }

  // 点击文章中的图片触发
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG' && target.closest('.prose')) {
      openViewer(target.getAttribute('src')!, target.alt);
    }
  });

  // 关闭
  closeBtn.addEventListener('click', closeViewer);
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer) closeViewer();
  });

  // 键盘控制
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeViewer();
  });
</script>
```

### Task 11: 创建 SearchBox 组件

**Files:**
- Create: `src/components/SearchBox.astro`

- [ ] **Step 1: 编写 SearchBox 组件**

```astro
<div class="relative w-full max-w-md mx-auto mb-8">
  <input
    id="search-input"
    type="search"
    placeholder="搜索文章..."
    autocomplete="off"
    class="w-full px-4 py-3 pl-10 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)] placeholder:text-[var(--color-text-muted)] dark:placeholder:text-[var(--color-text-muted-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] dark:focus:ring-[var(--color-accent-dark)] transition-shadow"
  />
  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
  <div id="search-results" class="hidden absolute top-full mt-2 w-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border)] dark:border-[var(--color-border-dark)] shadow-lg max-h-80 overflow-y-auto z-40">
    <!-- 搜索结果由 Pagefind 动态填充 -->
  </div>
</div>

<script>
  import { search } from '../utils/search';

  const input = document.getElementById('search-input') as HTMLInputElement;
  const results = document.getElementById('search-results')!;
  let debounceTimer: ReturnType<typeof setTimeout>;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = input.value.trim();

    if (query.length < 2) {
      results.classList.add('hidden');
      results.innerHTML = '';
      return;
    }

    debounceTimer = setTimeout(async () => {
      const hits = await search(query);
      if (hits.length === 0) {
        results.innerHTML = '<p class="p-4 text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">未找到相关文章</p>';
        results.classList.remove('hidden');
        return;
      }
      results.innerHTML = hits.map((h: any) => `
        <a href="${h.url}" class="block p-4 hover:bg-[var(--color-code-bg)] dark:hover:bg-[var(--color-code-bg-dark)] transition-colors no-underline border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)] last:border-0">
          <p class="text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">${h.meta?.title || h.url}</p>
          ${h.excerpt ? `<p class="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mt-1">${h.excerpt}</p>` : ''}
        </a>
      `).join('');
      results.classList.remove('hidden');
    }, 300);
  });

  // 点击外部关闭
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('#search-input') && !(e.target as HTMLElement).closest('#search-results')) {
      results.classList.add('hidden');
    }
  });
</script>
```

### Task 12: 创建搜索工具函数

**Files:**
- Create: `src/utils/search.ts`

- [ ] **Step 1: 编写 Pagefind 搜索封装**

```typescript
// Pagefind 在构建后生成静态索引文件到 /pagefind/
// 开发模式下搜索不可用，返回空数组

interface PagefindResult {
  url: string;
  excerpt: string;
  meta: {
    title?: string;
    image?: string;
  };
}

interface PagefindSearch {
  search(query: string): Promise<{ results: Array<{ url: string; excerpt: string; meta: Record<string, string> }> }>;
}

declare global {
  interface Window {
    pagefind?: PagefindSearch;
  }
}

// 延迟加载 Pagefind（只在搜索时加载）
let pagefindPromise: Promise<PagefindSearch | null> | null = null;

async function getPagefind(): Promise<PagefindSearch | null> {
  if (pagefindPromise) return pagefindPromise;

  pagefindPromise = new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }

    if (window.pagefind) {
      resolve(window.pagefind);
      return;
    }

    // 在生产环境动态加载 Pagefind
    import('/pagefind/pagefind.js')
      .then(() => {
        if (window.pagefind) {
          window.pagefind.init();
          resolve(window.pagefind);
        } else {
          resolve(null);
        }
      })
      .catch(() => resolve(null));
  });

  return pagefindPromise;
}

export async function search(query: string): Promise<PagefindResult[]> {
  if (query.length < 2) return [];

  const pagefind = await getPagefind();
  if (!pagefind) return [];

  try {
    const result = await pagefind.search(query);
    return result.results.slice(0, 10).map((r) => ({
      url: r.url,
      excerpt: r.excerpt,
      meta: r.meta as PagefindResult['meta'],
    }));
  } catch {
    return [];
  }
}
```

---

## Phase 4: 内容系统

### Task 13: 配置 Content Collections

**Files:**
- Modify: `src/content/config.ts`

- [ ] **Step 1: 配置博客 Content Collection Schema**

```typescript
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    cover: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    summary: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
```

### Task 14: 创建示例文章和占位图片

**Files:**
- Create: `src/content/blog/2026-06-04-hello-world.md`
- Create: `public/favicon.svg`

- [ ] **Step 1: 创建示例文章**

```markdown
---
title: "你好，世界！"
date: 2026-06-04
tags: ["astro", "博客"]
summary: "这是我的第一篇博客文章，记录搭建这个博客的过程。"
---

## 欢迎光临我的博客

这是我的新博客，基于 **Astro** 搭建。在这里我会分享技术心得、生活随笔和摄影作品。

### 为什么选择 Astro？

Astro 是一个现代化的静态站点生成器，默认输出零 JavaScript，只在需要时才加载交互代码。对于内容驱动的博客来说，这是最佳选择。

```js
console.log("Hello, Blog!");
```

希望你能在这里找到有趣的内容！
```

- [ ] **Step 2: 创建 favicon**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90">📝</text>
</svg>
```

保存到 `public/favicon.svg`

---

## Phase 5: 页面

### Task 15: 创建首页

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: 编写首页**

```astro
---
import Base from '../layouts/Base.astro';
import PostGrid from '../components/PostGrid.astro';
import SearchBox from '../components/SearchBox.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog'))
  .filter((post) => !post.data.draft)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---

<Base
  title="我的博客"
  description="一个关于技术、生活和摄影的个人博客"
>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
    <!-- Hero -->
    <section class="text-center mb-12 sm:mb-16">
      <h1 class="text-4xl sm:text-5xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)] tracking-tight">
        我的博客
      </h1>
      <p class="mt-4 text-lg text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] max-w-lg mx-auto">
        技术、生活、摄影 — 记录我所见所想
      </p>
    </section>

    <!-- 搜索 -->
    <SearchBox />

    <!-- 文章网格 -->
    <PostGrid posts={posts} />
  </div>
</Base>
```

### Task 16: 创建文章详情页

**Files:**
- Modify: `src/pages/blog/[slug].astro`
- Create: `src/layouts/Post.astro`

- [ ] **Step 1: 创建 Post 布局**

```astro
---
import type { CollectionEntry } from 'astro:content';
import Base from './Base.astro';
import TagBadge from '../components/TagBadge.astro';
import ImageViewer from '../components/ImageViewer.astro';

export interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;
const { title, date, cover, tags = [] } = post.data;

const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<Base title={title} description={post.data.summary || title} image={cover}>
  <article class="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
    <header class="mb-8 sm:mb-12">
      <time class="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]" datetime={date.toISOString()}>
        {formattedDate}
      </time>
      <h1 class="mt-4 text-3xl sm:text-4xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)] tracking-tight">
        {title}
      </h1>
      {tags.length > 0 && (
        <div class="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => <TagBadge tag={tag} />)}
        </div>
      )}
    </header>

    {cover && (
      <img
        src={cover}
        alt={title}
        class="w-full rounded-2xl mb-8 sm:mb-12 object-cover cursor-pointer"
      />
    )}

    <div class="prose prose-lg dark:prose-invert max-w-none">
      <slot />
    </div>

    <ImageViewer />
  </article>
</Base>
```

- [ ] **Step 2: 编写文章路由页**

```astro
---
import Post from '../../layouts/Post.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<Post post={post}>
  <Content />
</Post>
```

### Task 17: 创建标签筛选页

**Files:**
- Create: `src/pages/blog/tag/[tag].astro`

- [ ] **Step 1: 编写标签页**

```astro
---
import Base from '../../../layouts/Base.astro';
import PostGrid from '../../../components/PostGrid.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const allTags = [...new Set(posts.flatMap((p) => p.data.tags || []))];

  return allTags.map((tag) => ({
    params: { tag },
    props: {
      posts: posts.filter((p) => (p.data.tags || []).includes(tag)),
      tag,
    },
  }));
}

const { posts, tag } = Astro.props;
---

<Base
  title={`标签: #${tag}`}
  description={`包含标签"${tag}"的文章列表`}
>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
    <a href="/" class="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] hover:text-[var(--color-accent)] transition-colors no-underline inline-flex items-center gap-1 mb-6">
      &larr; 返回首页
    </a>
    <h1 class="text-3xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)] mb-2">
      #{tag}
    </h1>
    <p class="text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-8">
      {posts.length} 篇文章
    </p>
    <PostGrid posts={posts} />
  </div>
</Base>
```

### Task 18: 创建关于页

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: 编写关于页**

```astro
---
import Base from '../layouts/Base.astro';
---

<Base
  title="关于我"
  description="关于我和这个博客"
>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
    <h1 class="text-3xl sm:text-4xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">关于我</h1>
    <div class="mt-8 prose prose-lg dark:prose-invert max-w-none">
      <p>
        你好！我是这个博客的作者。
      </p>
      <p>
        这里记录了我的技术探索、生活感悟和摄影作品。使用 Astro 构建，追求简洁、快速的阅读体验。
      </p>
      <h2>联系我</h2>
      <ul>
        <li>GitHub: <a href="https://github.com">@myusername</a></li>
        <li>Email: <a href="mailto:me@example.com">me@example.com</a></li>
      </ul>
    </div>
  </div>
</Base>
```

### Task 19: 创建 RSS 订阅

**Files:**
- Modify: `src/pages/rss.xml.ts`

- [ ] **Step 1: 编写 RSS 端点**

```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: '我的博客',
    description: '一个关于技术、生活和摄影的个人博客',
    site: import.meta.env.SITE || 'https://myblog.vercel.app',
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary || '',
      link: `/blog/${post.slug}`,
    })),
    customData: '<language>zh-CN</language>',
  });
}
```

### Task 20: 创建 404 页面

**Files:**
- Modify: `src/pages/404.astro`

- [ ] **Step 1: 编写 404 页面**

```astro
---
import Base from '../layouts/Base.astro';
---

<Base
  title="页面不存在 - 404"
  description="你访问的页面不存在"
>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
    <h1 class="text-6xl font-bold text-[var(--color-accent)]">404</h1>
    <p class="mt-4 text-xl text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
      抱歉，你访问的页面不存在
    </p>
    <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="/" class="inline-flex items-center px-6 py-3 rounded-xl bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors no-underline font-medium">
        返回首页
      </a>
    </div>
  </div>
</Base>
```

---

## Phase 6: 项目配置

### Task 21: 配置 astro.config.ts

**Files:**
- Modify: `astro.config.ts`

- [ ] **Step 1: 完善 Astro 配置**

```typescript
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://myblog.vercel.app',
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
});
```

---

## Phase 7: 部署

### Task 22: 创建 GitHub Actions 部署工作流

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 编写 Vercel 部署工作流**

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx astro check

      - name: Build
        run: npm run build

      - name: Run Pagefind
        run: npx pagefind --site dist

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: ${{ github.event_name == 'push' && '--prod' || '' }}
```

---

## Phase 8: CLAUDE.md

### Task 23: 生成 CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: 编写 CLAUDE.md**

````markdown
# CLAUDE.md

## 项目概述

基于 Astro 的个人博客系统，源码托管 GitHub，Vercel 部署。

## 常用命令

```bash
npm run dev        # 启动开发服务器 (localhost:4321)
npm run build      # 生产构建
npm run preview    # 本地预览构建产物
npx astro check    # TypeScript 类型检查
npx astro add      # 添加集成
```

## 项目结构

```
src/
├── content/
│   └── blog/                  # Markdown 文章（Content Collections）
│       └── YYYY-MM-DD-slug.md # 命名规范：日期-短标题
├── components/                # Astro 组件
│   ├── Header.astro           # 导航栏（毛玻璃效果 + 暗色切换）
│   ├── Footer.astro           # 页脚
│   ├── PostCard.astro         # 文章卡片
│   ├── PostGrid.astro         # 文章网格
│   ├── ImageViewer.astro      # Lightbox 图片查看器
│   ├── TagBadge.astro         # 标签徽章
│   ├── SearchBox.astro        # 搜索框
│   └── ThemeToggle.astro      # 暗色模式切换按钮
├── layouts/
│   ├── Base.astro             # 基础布局（SEO + 暗色模式防闪白）
│   └── Post.astro             # 文章详情布局
├── pages/
│   ├── index.astro            # 首页
│   ├── blog/[slug].astro      # 文章详情
│   ├── blog/tag/[tag].astro   # 标签筛选
│   ├── about.astro            # 关于页
│   ├── rss.xml.ts             # RSS
│   └── 404.astro              # 404
├── styles/
│   └── global.css             # 全局样式 + CSS 变量 + Tailwind
└── utils/
    ├── theme.ts               # 暗色模式切换逻辑
    └── search.ts              # Pagefind 搜索封装
```

## 新增文章

在 `src/content/blog/` 下创建 `YYYY-MM-DD-slug.md`：

```markdown
---
title: "文章标题"
date: 2026-06-04
cover: "/images/cover.jpg"    # 可选
tags: ["标签1", "标签2"]       # 可选
summary: "文章摘要"             # 可选
draft: false                   # true 时构建跳过
---

正文（Markdown 格式）
```

## 设计令牌

| Token | 亮色 | 暗色 |
|-------|------|------|
| 背景 | `#fafaf8` | `#111110` |
| 卡片 | `#ffffff` | `#1a1a19` |
| 正文 | `#2d2d2a` | `#e0e0dd` |
| 强调 | `#e87b35` | `#f0984a` |

## 部署

- `git push main` → GitHub Actions 触发 → Vercel 生产部署
- PR → Vercel 自动创建预览部署
- 环境变量需在 Vercel Dashboard 配置：无（纯静态站点）

## 技术栈

- **框架**: Astro v6（SSG 模式）
- **样式**: Tailwind CSS v4（CSS-first 配置）
- **搜索**: Pagefind（构建时索引）
- **部署**: Vercel（GitHub Actions）
- **内容**: Markdown + Content Collections + Zod 校验
````

---

## Phase 9: 验证

### Task 24: 构建验证

- [ ] **Step 1: 运行类型检查**

```bash
npx astro check
```
预期：无错误。

- [ ] **Step 2: 运行生产构建**

```bash
npm run build
```
预期：构建成功，`dist/` 目录生成。

- [ ] **Step 3: 运行 Pagefind 索引**

```bash
npx pagefind --site dist
```
预期：索引成功生成到 `dist/pagefind/`。

- [ ] **Step 4: 本地预览验证**

```bash
npm run preview
```
手动检查：
- 首页显示文章卡片
- 点击文章进入详情页
- 标签点击跳转到标签页
- RSS `/rss.xml` 可访问
- 404 页面美观
- 暗色模式切换正常

- [ ] **Step 5: 提交所有代码**

```bash
git add -A
git commit -m "feat: complete blog system with Astro + Tailwind + Pagefind"
```
