import { ChevronRight, Newspaper } from "lucide-react";
import Link from "next/link";
import { getBlogPosts } from "@/app/actions/blog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/lib/try-catch";
import { PostCard } from "./cards/postCard";

export const BlogDisplay = async () => {
	const { data, error } = await tryCatch(
		getBlogPosts({
			limit: 3,
		}),
	);

	if (error) return null;

	return (
		<div className="flex w-full flex-col gap-6">
			<div className="flex w-full flex-col gap-1 pb-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-start gap-3 sm:items-center">
					<Newspaper className="h-6 w-6 text-primary" />
					<div className="flex flex-col">
						<h3 className="font-semibold text-xl leading-snug tracking-tight sm:text-2xl">
							Blog Posts
						</h3>
						<p className="mt-0.5 hidden text-muted-foreground text-xs sm:block">
							Latest articles & updates
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button asChild variant="link" size="sm">
						<Link href="/blog" aria-label="View all blog posts">
							View all
							<ChevronRight className="h-4 w-4" />
						</Link>
					</Button>
				</div>
			</div>

			{/* Posts grid */}
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{data?.posts?.map((post) => (
					<PostCard key={post.id} {...post} />
				))}
			</div>
		</div>
	);
};
