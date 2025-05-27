import { cache } from "react";
import { api } from "@/trpc/server";

export const getBlogPosts = cache(async () => await api.blog.listPosts());
export const getBlogPost = cache(
	async (slug: string) => await api.blog.getPostBySlug({ slug }),
);
