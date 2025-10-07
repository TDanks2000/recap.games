import { cache } from "react";
import { api } from "@/trpc/server";

export const getBlogPosts = cache(
	async (
		{ limit, page }: { limit?: number; page?: number } = {
			limit: undefined,
			page: undefined,
		},
	) =>
		await api.blog.listPosts({
			limit,
			page,
		}),
);
export const getBlogPost = cache(
	async (slug: string) => await api.blog.getPostBySlug({ slug }),
);
