import { format, isValid } from "date-fns";
import type { RouterOutputs } from "@/trpc/react";

const DATE_FORMAT = "MMM d, yyyy";
const numberFormatter = new Intl.NumberFormat();

type Post = RouterOutputs["blog"]["getAllPostsAnalytics"]["topPosts"][number];

function getPublishedDate(post: Post): string {
	const updated = post.updatedAt ? new Date(post.updatedAt) : null;
	const created = post.createdAt ? new Date(post.createdAt) : null;

	if (updated && isValid(updated)) {
		return format(updated, DATE_FORMAT);
	}
	if (created && isValid(created)) {
		return format(created, DATE_FORMAT);
	}
	return "Unknown";
}

export function TopPostRow({ post }: { post: Post }) {
	return (
		<div className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50">
			<div>
				<p className="font-medium">{post.title}</p>
				<p className="text-muted-foreground text-xs">
					Published {getPublishedDate(post)}
				</p>
			</div>
			<div className="text-right">
				<p className="font-medium">
					{!!post.viewCount && numberFormatter.format(post.viewCount)} views
				</p>
			</div>
		</div>
	);
}
