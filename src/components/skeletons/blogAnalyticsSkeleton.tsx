// components/skeletons/BlogAnalyticsSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { TopPostRowSkeleton } from "./topPostRowSkeleton";

export function BlogAnalyticsSkeleton() {
	return (
		<div>
			<Skeleton className="mb-4 h-7 w-40" />
			<div className="grid gap-4 md:grid-cols-2">
				<div>
					<Skeleton className="mb-2 h-20 w-full" />
				</div>
				<div>
					<Skeleton className="mb-2 h-20 w-full" />
				</div>
			</div>
			<Skeleton className="mt-6 mb-3 h-6 w-48" />{" "}
			{/* Top Performing Posts title */}
			<div className="space-y-2">
				{[...Array(3)].map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: this is fine for a skeleton
					<TopPostRowSkeleton key={i} />
				))}
			</div>
		</div>
	);
}
