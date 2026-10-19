import { getCollection, type CollectionEntry } from 'astro:content';
import { topics, type Topic } from '../data/topics';

export const projectCategories = { product: '产品实践', tool: '实用工具', experiment: '探索实验' };
export const projectStatuses = { active: '持续迭代', exploring: '探索中', prototype: '产品原型' };

export function formatDate(date: Date) {
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });
}

export async function getPortfolio() {
  const [allProjects, allPosts, allNotes] = await Promise.all([
    getCollection('projects'), getCollection('blog'), getCollection('notes'),
  ]);
  const projects = allProjects.sort((a, b) => a.data.order - b.data.order);
  const posts = allPosts.filter((post) => !post.data.draft).sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
  const notes = allNotes.filter((note) => !note.data.draft).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const projectIds = new Set(projects.map((project) => project.id));
  const postIds = new Set(posts.map((post) => post.id));
  const topicIds = new Set(topics.map((topic) => topic.id));
  for (const topic of topics) {
    for (const id of topic.projectIds) {
      if (!projectIds.has(id)) throw new Error(`Unknown project "${id}" in topic ${topic.id}`);
    }
    for (const id of topic.postIds) {
      if (!postIds.has(id)) throw new Error(`Unknown article "${id}" in topic ${topic.id}`);
    }
  }
  for (const entry of [...projects, ...posts, ...notes]) {
    for (const id of entry.data.topics) {
      if (!topicIds.has(id)) throw new Error(`Unknown topic "${id}" in ${entry.collection}/${entry.id}`);
    }
    if ('projects' in entry.data) {
      for (const id of entry.data.projects) {
        if (!projectIds.has(id)) throw new Error(`Unknown project "${id}" in ${entry.collection}/${entry.id}`);
      }
    }
  }
  return { projects, posts, notes };
}

export function postsForTopic(topic: Topic, posts: CollectionEntry<'blog'>[]) {
  const ids = new Set(topic.postIds);
  return posts.filter((post) => ids.has(post.id) || post.data.topics.includes(topic.id)).sort((a, b) => {
    const ai = topic.postIds.indexOf(a.id);
    const bi = topic.postIds.indexOf(b.id);
    return (ai < 0 ? Infinity : ai) - (bi < 0 ? Infinity : bi);
  });
}

export function projectsForTopic(topic: Topic, projects: CollectionEntry<'projects'>[]) {
  return projects.filter((project) => topic.projectIds.includes(project.id) || project.data.topics.includes(topic.id));
}
