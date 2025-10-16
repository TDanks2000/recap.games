"use client";

import { format } from "date-fns";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/trpc/react";

interface Props {
	searchQuery: string;
}

export default function BlogPostsList({ searchQuery }: Props) {
	const utils = api.useUtils();
	const {
		data: posts,
		isLoading,
		error,
	} = api.blog.getAllPostsAnalytics.useQuery();

	const [postToDelete, setPostToDelete] = useState<number | null>(null);

	const deletePostMutation = api.blog.deletePost.useMutation({
		onSuccess: () => {
			toast.success("Blog post deleted successfully");
			utils.blog.getAllPostsAnalytics.invalidate();
		},
		onError: (error) => {
			toast.error(`Error deleting post: ${error.message}`);
		},
	});

	const handleDelete = (id: number) => {
		setPostToDelete(id);
	};

	const confirmDelete = () => {
		if (postToDelete !== null) {
			deletePostMutation.mutate({ id: postToDelete });
			setPostToDelete(null);
		}
	};

	const formatDate = (date: Date | null | undefined) => {
		if (!date) return "Not scheduled";
		return format(date, "MMM d, yyyy h:mm a");
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: this is fine for a skeleton
						key={i}
						className="space-y-2"
					>
						<Skeleton className="h-6 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
						<Separator className="my-2" />
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return <p className="text-muted-foreground">{error.message}</p>;
	}

	if (!posts || posts.postsWithAnalytics.length === 0) {
		return <p className="text-muted-foreground">No blog posts found.</p>;
	}

	const filteredPosts = posts.postsWithAnalytics.filter((post) =>
		post.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
	);

	if (filteredPosts.length === 0) {
		return (
			<p className="text-muted-foreground">
				No posts found{searchQuery ? " for this search." : "."}
			</p>
		);
	}

	return (
		<>
			<div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
				{filteredPosts.map((post) => (
					<div key={post.postId} className="space-y-2">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<h3 className="font-medium">{post.title}</h3>
									{!post.published && <Badge variant="secondary">Draft</Badge>}
									{post.scheduledAt &&
										new Date(post.scheduledAt) > new Date() && (
											<Badge variant="outline">Scheduled</Badge>
										)}
								</div>
								<p className="text-muted-foreground text-sm">
									{formatDate(post.updatedAt || post.createdAt)}
									{post.scheduledAt &&
										post.scheduledAt !== post.createdAt &&
										` • Scheduled: ${formatDate(post.scheduledAt)}`}
								</p>
								<p className="text-muted-foreground text-xs">
									{post.viewCount || 0} views • {post.uniqueViewCount || 0}{" "}
									unique views •
									{post.averageReadTime
										? ` ${Math.round(post.averageReadTime)}min avg read`
										: " No read data"}
								</p>
							</div>
							<div className="flex gap-2 self-end sm:self-start">
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="ghost" size="icon" asChild>
											<a
												href={`/blog/${post.slug}`}
												target="_blank"
												rel="noopener noreferrer"
												aria-label={`View ${post.title}`}
											>
												<Eye className="h-4 w-4" />
											</a>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>View post in new tab</p>
									</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="ghost" size="icon" asChild>
											<a
												href={`/blog/${post.slug}/edit`}
												aria-label={`Edit ${post.title}`}
											>
												<Edit className="h-4 w-4" />
											</a>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Edit this post</p>
									</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(post.postId)}
											disabled={deletePostMutation.isPending}
											aria-label={`Delete ${post.title}`}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Delete this post</p>
									</TooltipContent>
								</Tooltip>
							</div>
						</div>
						<Separator className="my-2" />
					</div>
				))}
			</div>

			<AlertDialog
				open={postToDelete !== null}
				onOpenChange={(open) => !open && setPostToDelete(null)}
			>
				<AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							blog post and remove it from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
