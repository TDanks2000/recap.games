import { GameCardSkeleton } from "./GameCardSkeleton";

export function GamesGridSkeleton() {
	return (
		<div
			className="grid w-full gap-6"
			style={{
				gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
			}}
		>
			{Array.from({ length: 12 }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: fine for skeleton
				<GameCardSkeleton key={i} />
			))}
		</div>
	);
}
