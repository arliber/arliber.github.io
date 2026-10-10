import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    status: z.enum(['active', 'prototype', 'planning']),
    summary: z.string(),
    image: z.string().optional(),
    order: z.number().optional(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z
    .object({
      title: z.string(),
      dek: z.string(),
      date: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).optional(),
      project: reference('projects').optional(),
    })
    .refine((p) => p.draft || p.date, { message: 'Published posts need a `date` (or set `draft: true`).' }),
});

// Extend this list to add a tag; the Reading filters are built from it.
export const READING_TAGS = ['agents', 'ml', 'design', 'tools', 'hardware', 'space', 'science', 'maps', 'work'] as const;
// Each type gets its own pixel icon (src/components/TypeIcon.astro).
export const READING_TYPES = ['article', 'book', 'podcast', 'video'] as const;

const reading = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reading' }),
  schema: z.object({
    url: z.url(),
    type: z.enum(READING_TYPES).default('article'),
    title: z.string(),
    description: z.string(),
    tag: z.enum(READING_TAGS),
    saved: z.coerce.date(),
    note: z.string().optional(),
  }),
});

export const collections = { projects, writing, reading };
