import { Gamepad2 } from "lucide-react";
import type { RouterOutputs } from "@/trpc/react";
import { PostCard } from "./cards/postCard";

interface PostGridProps {
	posts: RouterOutputs["blog"]["listPosts"]["posts"];
	featuredPostId?: number;
}

export function PostGrid({ posts, featuredPostId }: PostGridProps) {
	if (!posts.length) {
		return (
			<div className="flex items-center justify-center py-24">
				<div className="text-center">
					<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
						<Gamepad2 className="h-8 w-8 text-muted-foreground" />
					</div>
					<h3 className="mb-2 font-semibold text-foreground text-lg">
						No posts yet
					</h3>
					<p className="max-w-sm text-muted-foreground text-sm">
						Check back soon for gaming insights, reviews, and industry updates!
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="grid gap-6 md:gap-8">
			{featuredPostId && (
				<div className="mb-8">
					{posts
						.filter((post) => post.id === featuredPostId)
						.map((post) => (
							<PostCard key={post.id} {...post} featured />
						))}
				</div>
			)}

			{/* Regular posts grid */}
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{posts
					.filter((post) => post.id !== featuredPostId)
					.map((post) => (
						<PostCard key={post.id} {...post} />
					))}
			</div>
		</div>
	);
}
