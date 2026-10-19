import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const blogCollection = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!images/**'], base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    cover: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    summary: z.string().optional(),
    draft: z.boolean().optional().default(false),
    kind: z.enum(['essay', 'note']).default('essay'),
    featured: z.boolean().default(false),
    topics: z.array(z.string()).default([]),
    projects: z.array(z.string()).default([]),
    updatedAt: z.coerce.date().optional(),
    attribution: z.object({ label: z.string(), url: z.url() }).optional(),
  }),
});

const projectCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    summary: z.string(),
    category: z.enum(['product', 'tool', 'experiment']),
    status: z.enum(['active', 'exploring', 'prototype']),
    origin: z.string(),
    featured: z.boolean().default(false),
    order: z.number(),
    topics: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    repository: z.url().optional(),
    demo: z.url().optional(),
    cover: z.string().optional(),
    focus: z.string(),
    updatedAt: z.coerce.date(),
  }),
});

const noteCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    topics: z.array(z.string()).default([]),
    projects: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectCollection,
  notes: noteCollection,
};
