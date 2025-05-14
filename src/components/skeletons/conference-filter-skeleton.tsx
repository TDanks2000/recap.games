import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

export function ConferenceFilterSkeleton() {
	return (
		<div className="h-9 w-[260px] overflow-hidden">
			<Skeleton
				className={cn(
					buttonVariants({
						variant: "outline",
					}),
					"w-full cursor-default",
				)}
			/>
		</div>
	);
}
