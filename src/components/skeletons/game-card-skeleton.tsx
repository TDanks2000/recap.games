export const GameCardSkeleton = () => (
	<div className="shrink grow animate-pulse sm:w-[280px] sm:flex-1 md:w-[300px]">
		<div className="w-full overflow-hidden rounded-xl bg-muted/50 pt-0 shadow-sm">
			<div className="aspect-video w-full bg-muted" />
			<div className="space-y-3 p-4">
				<div className="h-6 w-24 rounded-full bg-muted" />
				<div className="space-y-2">
					<div className="h-4 w-3/4 rounded bg-muted" />
					<div className="h-3 w-1/2 rounded bg-muted" />
				</div>
			</div>
		</div>
	</div>
);
