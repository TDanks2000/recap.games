"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import { BlogAnalyticsSkeleton } from "@/components/skeletons/blogAnalyticsSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/trpc/react";
import { TopPostRow } from "./topPostRow";

const numberFormatter = new Intl.NumberFormat();

export function BlogAnalytics() {
	const { data, isPending, error } = api.blog.getAllPostsAnalytics.useQuery();

	if (isPending)
		return (
			<div aria-live="polite">
				<BlogAnalyticsSkeleton />
			</div>
		);

	if (error)
		return (
			<div aria-live="polite">
				<Card>
					<CardContent className="py-8 text-center text-destructive">
						An error has occurred: {error.message}
					</CardContent>
				</Card>
			</div>
		);

	if (!data)
		return (
			<div aria-live="polite">
				<Card>
					<CardContent className="py-8 text-center text-muted-foreground">
						No data available.
					</CardContent>
				</Card>
			</div>
		);

	return (
		<div>
			<h3 className="mb-4 font-semibold text-xl">Blog Performance</h3>
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="font-medium text-sm">Total Views</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="flex w-fit items-baseline gap-1 font-bold text-2xl">
							{numberFormatter.format(data.totalStats.totalViews)}
							<span className="text-base text-muted-foreground">views</span>
						</div>
						<Tooltip>
							<TooltipTrigger asChild>
								<p className="w-fit cursor-help text-muted-foreground text-xs underline decoration-dotted">
									All-time blog post views
								</p>
							</TooltipTrigger>
							<TooltipContent>
								This is the total number of times all your blog posts have been
								viewed, including repeat views by the same visitor.
							</TooltipContent>
						</Tooltip>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="font-medium text-sm">
							Engagement Rate
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>

					<CardContent>
						<div className="flex items-baseline gap-1 font-bold text-2xl">
							{numberFormatter.format(
								data.totalStats.averageReadTimeAcrossAllPosts,
							)}
							<span className="text-base text-muted-foreground">min</span>
						</div>
						<Tooltip>
							<TooltipTrigger asChild>
								<p className="w-fit cursor-help text-muted-foreground text-xs underline decoration-dotted">
									Average read time
								</p>
							</TooltipTrigger>
							<TooltipContent align="start">
								This is the average estimated time (in minutes) readers spend on
								your posts, calculated across all your published content.
							</TooltipContent>
						</Tooltip>
					</CardContent>
				</Card>
			</div>

			<div className="mt-6">
				<h4 className="mb-3 font-medium">Top Performing Posts</h4>
				<div className="space-y-2">
					{data.topPosts.length === 0 ? (
						<p className="text-muted-foreground text-sm">No top posts yet.</p>
					) : (
						data.topPosts.map((post) => (
							<TopPostRow key={post.postId} post={post} />
						))
					)}
				</div>
			</div>
		</div>
	);
}
