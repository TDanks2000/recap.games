import { Skeleton } from "@/components/ui/skeleton";

export function SortingSkeleton() {
	return (
		<div className="w-[180px]">
			<Skeleton className="h-10 w-full rounded-md" />
		</div>
	);
}
