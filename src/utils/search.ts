export type SearchType = 'project' | 'article' | 'note';
export type SearchFilter = SearchType | 'all';

export interface SearchEntry {
  type: SearchType;
  url: string;
  title: string;
  summary: string;
  text: string;
}

export type SearchHit = Omit<SearchEntry, 'text'>;
export const searchTypeLabels: Record<SearchType, string> = { project: '作品', article: '文章', note: '随记' };

interface PagefindModule {
  init(): Promise<void>;
  search(query: string): Promise<{ results: Array<{ data(): Promise<{ url: string }> }> }>;
}

let pagefindPromise: Promise<PagefindModule> | undefined;
let indexPromise: Promise<SearchEntry[]> | undefined;

async function getPagefind(): Promise<PagefindModule> {
  if (!pagefindPromise) {
    const pagefindUrl = '/pagefind/pagefind.js';
    pagefindPromise = import(/* @vite-ignore */ pagefindUrl).then(async (module: PagefindModule) => {
      await module.init();
      return module;
    }).catch((error: unknown) => {
      pagefindPromise = undefined;
      throw error;
    });
  }
  return pagefindPromise;
}

async function getIndex(): Promise<SearchEntry[]> {
  if (!indexPromise) {
    indexPromise = fetch('/search-index.json').then(async (response) => {
      if (!response.ok) throw new Error('搜索索引暂时无法加载');
      return await response.json() as SearchEntry[];
    }).catch((error: unknown) => {
      indexPromise = undefined;
      throw error;
    });
  }
  return indexPromise;
}

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase('zh-CN');
const canonicalPath = (url: string) => {
  const path = new URL(url, window.location.origin).pathname;
  return decodeURIComponent(path).replace(/\/+$/, '') || '/';
};

function localMatches(entries: SearchEntry[], query: string) {
  const terms = normalize(query).split(/\s+/u).filter(Boolean);
  return entries.map((entry) => {
    const title = normalize(entry.title);
    const summary = normalize(entry.summary);
    const text = normalize(entry.text);
    const score = terms.reduce((total, term) => total + (title.includes(term) ? 8 : summary.includes(term) ? 4 : text.includes(term) ? 1 : 0), 0);
    return { entry, score, matches: terms.every((term) => `${title} ${summary} ${text}`.includes(term)) };
  }).filter((result) => result.matches).sort((a, b) => b.score - a.score).map((result) => result.entry);
}

/** An empty array means no matches. Loading or search failures are deliberately thrown. */
export async function search(query: string, options: { type?: SearchFilter; limit?: number } = {}): Promise<SearchHit[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const entries = await getIndex();
  const allowed = entries.filter((entry) => !options.type || options.type === 'all' || entry.type === options.type);
  let matches: SearchEntry[];

  if (import.meta.env.DEV) {
    matches = localMatches(allowed, trimmed);
  } else {
    const pagefind = await getPagefind();
    const result = await pagefind.search(trimmed);
    const data = await Promise.all(result.results.map((hit) => hit.data()));
    const byUrl = new Map(allowed.map((entry) => [canonicalPath(entry.url), entry]));
    const seen = new Set<string>();
    matches = [];
    for (const hit of data) {
      const entry = byUrl.get(canonicalPath(hit.url));
      if (entry && !seen.has(entry.url)) {
        seen.add(entry.url);
        matches.push(entry);
      }
    }
    // Substring matching also supports a single Chinese character and unsegmented names.
    for (const entry of localMatches(allowed, trimmed)) {
      if (!seen.has(entry.url)) matches.push(entry);
    }
  }

  return matches.slice(0, options.limit ?? 10).map(({ type, url, title, summary }) => ({ type, url, title, summary }));
}
