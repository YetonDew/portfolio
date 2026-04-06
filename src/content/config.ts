import { defineCollection, z } from "astro:content";

const aboutCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		label: z.string().default("Article"),
		description: z.string().optional(),
	}),
});

export const collections = {
	about: aboutCollection,
};
