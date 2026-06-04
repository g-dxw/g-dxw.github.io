import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: '我的博客',
    description: '一个关于技术、生活和摄影的个人博客',
    site: 'https://myblog.vercel.app',
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary || '',
      link: `/blog/${post.id}`,
    })),
    customData: '<language>zh-CN</language>',
  });
}
