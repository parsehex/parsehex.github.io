import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
	}),
});

const readmesCollection = defineCollection({
	type: 'content',
	schema: z.object({}),
});

export const collections = {
	projects: projectsCollection,
	readmes: readmesCollection,
};
