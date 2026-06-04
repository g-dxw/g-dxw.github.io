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
  init(): Promise<void>;
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

    // 在生产环境动态加载 Pagefind（使用变量阻止 Vite/Rollup 静态分析）
    const pagefindUrl = '/pagefind/pagefind.js';
    import(pagefindUrl)
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
