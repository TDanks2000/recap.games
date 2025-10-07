import type { MetadataRoute } from "next";
import { getBlogPosts } from "./actions/blog";

type SitemapEntry = MetadataRoute.Sitemap[number];

const BASE_URL = "https://recap.games";

// Define static routes and their priorities
const STATIC_ROUTES: Array<{ path: string; priority: number }> = [
	{ path: "", priority: 1.0 },
	{ path: "/about", priority: 0.8 },
	{ path: "/blog", priority: 0.8 },
	{ path: "/donations", priority: 0.8 },
	{ path: "/privacy-policy", priority: 0.8 },
	{ path: "/contact", priority: 0.8 },
];

export default async function sitemap(): Promise<SitemapEntry[]> {
	// Generate sitemap entries for static routes
	const staticEntries: SitemapEntry[] = STATIC_ROUTES.map(
		({ path, priority }) => ({
			url: `${BASE_URL}${path}`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority,
		}),
	);

	// Fetch blog posts
	const blogPosts = await getBlogPosts();

	// Generate sitemap entries for blog posts
	const blogEntries: SitemapEntry[] = (blogPosts?.posts ?? [])
		.filter((post) => post.published) // Only include published posts
		.map((post) => ({
			url: `${BASE_URL}/blog/${post.slug}`,
			lastModified: post.updatedAt
				? new Date(post.updatedAt)
				: new Date(post.createdAt),
			changeFrequency: "weekly",
			priority: 0.6,
		}));

	// Combine and return all entries
	return [...staticEntries, ...blogEntries];
}
