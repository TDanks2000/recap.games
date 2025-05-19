"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import { BlogAnalyticsSkeleton } from "@/components/skeletons/blogAnalyticsSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
						<div className="font-bold text-2xl">
							{numberFormatter.format(data.totalStats.totalViews)}
						</div>
						<p className="text-muted-foreground text-xs">
							All-time blog post views
						</p>
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
						<div className="font-bold text-2xl">
							{numberFormatter.format(
								data.totalStats.averageReadTimeAcrossAllPosts,
							)}
						</div>
						<p className="text-muted-foreground text-xs">Average read time</p>
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
