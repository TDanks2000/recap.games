import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const VideoCardSkeleton = () => {
	return (
		<Card className="overflow-hidden pt-0">
			<Skeleton className="aspect-video w-full" />
			<CardHeader className="pb-2 pt-4">
				<div className="space-y-1">
					<Skeleton className="h-3 w-3/5" />
					<Skeleton className="h-5 w-full" />
					<Skeleton className="h-5 w-4/5" />
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-11/12" />{" "}
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-between pt-0">
				<Skeleton className="h-4 w-1/3" />
				<Skeleton className="h-7 w-1/4" />
			</CardFooter>
		</Card>
	);
};
