import rss from '@astrojs/rss';
import { getCollection, render } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const items = await Promise.all(
    sorted.map(async (post) => {
      const { Content } = await render(post);
      // 将文章渲染为 HTML 字符串
      const content = await renderToString(Content);
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.summary || '',
        link: `/blog/${post.id}`,
        content,
      };
    })
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: import.meta.env.SITE,
    items,
    customData: '<language>zh-CN</language>',
  });
}

// 辅助：将 Astro Content 组件渲染为 HTML 字符串
async function renderToString(Content: any): Promise<string> {
  try {
    const { experimental_AstroContainer } = await import('astro/container');
    const container = await experimental_AstroContainer.create();
    return await container.renderToString(Content);
  } catch {
    return '';
  }
}
