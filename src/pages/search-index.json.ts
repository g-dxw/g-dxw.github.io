import type { APIRoute } from 'astro';
import { getPortfolio } from '../utils/portfolio';
import type { SearchEntry } from '../utils/search';

export const prerender = true;

function plainText(markdown = ''): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^[\s>*#|-]+/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = async () => {
  const { projects, posts, notes } = await getPortfolio();
  const entries: SearchEntry[] = [
    ...projects.map((project) => ({
      type: 'project' as const,
      url: `/projects/${project.id}/`,
      title: project.data.title,
      summary: plainText(project.data.summary),
      text: plainText([project.data.subtitle, project.body, ...project.data.stack].join(' ')),
    })),
    ...posts.map((post) => ({
      type: post.data.kind === 'note' ? 'note' as const : 'article' as const,
      url: `/blog/${post.id}/`,
      title: post.data.title,
      summary: plainText(post.data.summary || post.body).slice(0, 160),
      text: plainText([post.body, ...post.data.tags].join(' ')),
    })),
    ...notes.map((note) => ({
      type: 'note' as const,
      url: `/notes/${note.id}/`,
      title: note.data.title,
      summary: plainText(note.data.summary),
      text: plainText([note.body, ...note.data.tags].join(' ')),
    })),
  ];
  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
