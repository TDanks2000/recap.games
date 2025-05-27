import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { BlogHero } from "@/features/blog/components/blogHero";
import { PostCard } from "@/features/blog/components/cards/postCard";
import { BlogLayout } from "@/features/blog/components/Layout";
import { HydrateClient } from "@/trpc/server";
import { getBlogPosts } from "../actions/blog";

const BASE_URL_STR = "https://recap.games";
const BLOG_PAGE_PATH = "/blog";
const BLOG_PAGE_URL = `${BASE_URL_STR}${BLOG_PAGE_PATH}`;

export const metadata: Metadata = {
	title: "Gaming Blog: News, Insights & Updates",
	description:
		"Explore the latest gaming news, insightful articles, and updates from the Game Trailers Recapped blog. Your source for all things video games.",
	keywords: [
		"gaming blog",
		"video game news",
		"game articles",
		"game industry insights",
		"game updates",
		"esports news",
		"latest game trailers blog",
	],
	alternates: {
		canonical: BLOG_PAGE_URL,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: BLOG_PAGE_URL,
		title: "Game Trailers Recapped Blog: Latest Gaming News & Insights",
		description:
			"Dive into our blog for the latest video game news, articles, and updates. Stay informed with Game Trailers Recapped.",
		siteName: "Game Trailers Recapped",
		images: [
			{
				url: new URL("/social-large.webp", BASE_URL_STR).toString(),
				width: 1200,
				height: 630,
				alt: "Game Trailers Recapped Blog",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@gamesrecapped",
		creator: "@tommydanks", // Corrected
		title: "Game Trailers Recapped Blog: Gaming News & More",
		description:
			"Your go-to source for gaming news, articles, and insights. Follow the Game Trailers Recapped blog! #GamingBlog #VideoGames",
		images: [new URL("/social-large.webp", BASE_URL_STR).toString()],
	},
};

export default async function BlogsPage() {
	const posts = await getBlogPosts();

	const blogSchema = {
		"@context": "https://schema.org",
		"@type": "Blog",
		name: "Game Trailers Recapped Blog",
		url: BLOG_PAGE_URL,
		description:
			"The official blog for Game Trailers Recapped, featuring the latest gaming news, insightful articles, and updates.",
		publisher: {
			"@type": "Organization",
			name: "Game Trailers Recapped",
			logo: {
				"@type": "ImageObject",
				url: new URL("/favicon.ico", BASE_URL_STR).toString(),
			},
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": BLOG_PAGE_URL,
		},
	};

	return (
		<HydrateClient>
			<BlogLayout>
				<script type="application/ld+json">{JSON.stringify(blogSchema)}</script>
				<BlogHero
					title="Blog Posts"
					breadcrumb={[{ href: BLOG_PAGE_PATH, label: "Blog" }]}
				/>

				<section className="-mt-16 relative z-10">
					<div className="mx-auto max-w-7xl px-8 sm:px-16">
						{!posts?.length ? (
							<Card className="mt-10 p-8">
								<CardContent className="flex flex-col items-center space-y-4">
									<div className="space-y-2 text-center">
										<h3 className="font-semibold text-xl leading-6">
											No blog posts yet
										</h3>
										<p className="text-muted-foreground">
											Create your first blog post to share your thoughts
										</p>
									</div>
								</CardContent>
							</Card>
						) : (
							<div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-2 lg:grid-cols-3">
								{posts.map((post) => (
									<div key={post.id}>
										<PostCard {...post} />
									</div>
								))}
							</div>
						)}
					</div>
				</section>
			</BlogLayout>
		</HydrateClient>
	);
}
