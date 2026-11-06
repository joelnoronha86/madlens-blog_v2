import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    excerpt: z.string(),
    author: z.string().default('Dr. E. Archer'),
    pubDate: z.coerce.date(),
    issue: z.string().default('FIELD LOG // NATURAL DYES'),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    specimen: z.object({
      name: z.string(),
      commonName: z.string().optional(),
      logNo: z.string().optional(),
      origin: z.string().optional(),
      coordinates: z.string().optional(),
      process: z.string().optional(),
      chemicalStructure: z.object({
        name: z.string(),
        formula: z.string(),
        description: z.string().optional(),
      }).optional(),
    }).optional(),
    swatches: z.array(z.object({
      name: z.string(),
      binomial: z.string().optional(),
      color: z.string(),
      texture: z.string().default('linen'),
    })).default([]),
    coverImage: z.string().optional(),
    coverCaption: z.string().optional(),
  }),
});

export const collections = { posts };
