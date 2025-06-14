export function GameCardSkeleton() {
	return (
		<div className="flex w-full animate-pulse flex-col gap-2 rounded-xl bg-muted/50 p-2">
			<div className="aspect-video w-full rounded-lg bg-muted" />
			<div className="h-5 w-1/3 rounded-md bg-muted" />
			<div className="h-4 w-1/2 rounded-md bg-muted" />
			<div className="h-4 w-3/4 rounded-md bg-muted" />
		</div>
	);
}
