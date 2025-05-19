// components/skeletons/TopPostRowSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function TopPostRowSkeleton() {
	return (
		<div className="flex items-center justify-between rounded-md border p-3">
			<div>
				<Skeleton className="mb-2 h-4 w-32" />
				<Skeleton className="h-3 w-20" />
			</div>
			<div className="text-right">
				<Skeleton className="h-4 w-16" />
			</div>
		</div>
	);
}
