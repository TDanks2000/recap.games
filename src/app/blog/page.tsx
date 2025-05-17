import { Card, CardContent } from "@/components/ui/card";
import { BlogHero } from "@/features/blog/components/blogHero";
import { PostCard } from "@/features/blog/components/cards/postCard";
import { BlogLayout } from "@/features/blog/components/Layout";
import { HydrateClient } from "@/trpc/server";
import { getBlogPosts } from "../actions/blog";

export default async function BlogsPage() {
	const posts = await getBlogPosts();

	return (
		<HydrateClient>
			<BlogLayout>
				<BlogHero
					title="Blog Posts"
					breadcrumb={[{ href: "/blog", label: "Blog" }]}
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
