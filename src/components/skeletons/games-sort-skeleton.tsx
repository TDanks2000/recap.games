import { Skeleton } from "@/components/ui/skeleton";

export function GamesSortSkeleton() {
	return (
		<div className="flex h-[56px] w-[260px] flex-col gap-2">
			<Skeleton className="h-10 w-full rounded-md" />
		</div>
	);
}
