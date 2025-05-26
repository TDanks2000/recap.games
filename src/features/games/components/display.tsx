import { Gamepad2 } from "lucide-react";
import { Suspense } from "react";
import type { HomeSearchParams, PaginationOptions } from "@/@types";
import { ConferenceFilterSkeleton } from "@/components/skeletons/conference-filter-skeleton";
import { GamesSortSkeleton } from "@/components/skeletons/games-sort-skeleton";
import { api } from "@/trpc/server";
import { filterAndSortGames } from "../utils/filterAndSortGames";
import ConferenceFilterClient from "./ConferenceFilterClient";
import GameCard from "./cards/game";
import GamesSortClient from "./GamesSortClient";

type GamesDisplayProps = PaginationOptions & {
	searchParams: HomeSearchParams;
};

export default async function GamesDisplay({
	searchParams,
}: GamesDisplayProps) {
	// fetch games & conferences on the server
	const [games] = await Promise.all([
		api.game.getAll(),
		// api.conference.getAll(),
	]);

	const filteredGames = filterAndSortGames(games, searchParams);

	// parse selected conference IDs from searchParams (for empty state message)
	const selectedConferences = (searchParams.conferences ?? "")
		.split(",")
		.map((s) => Number(s))
		.filter((n) => !Number.isNaN(n) && n > 0);

	return (
		<div className="flex w-full flex-col gap-6 ">
			{/* Header */}
			<div className="flex w-full flex-col items-start justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
				<div className="flex items-center gap-2">
					<Gamepad2 className="h-6 w-6 text-primary" />
					<h3 className="font-semibold text-xl tracking-tight sm:text-2xl">
						Games
					</h3>
				</div>
				<div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
					<Suspense fallback={<GamesSortSkeleton />}>
						<GamesSortClient directionOnLeft />
					</Suspense>
					<Suspense fallback={<ConferenceFilterSkeleton />}>
						<ConferenceFilterClient />
					</Suspense>
				</div>
			</div>

			{/* Games Grid */}
			{filteredGames.length === 0 ? (
				<div className="col-span-full flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-muted/50 py-12 text-center">
					<Gamepad2 className="h-12 w-12 text-muted-foreground" />
					<h3 className="font-semibold text-xl">No Games Found</h3>
					<p className="text-muted-foreground text-sm">
						{selectedConferences.length > 0
							? "Try adjusting your conference filter"
							: "Check back later for new games"}
					</p>
					<p className="mt-4 text-muted-foreground text-sm">
						Are you looking for last year's games?{" "}
						<a
							href="https://old.recap.games/"
							className="text-primary underline"
							target="_blank"
							rel="noreferrer"
						>
							Visit the old recap website
						</a>
					</p>
				</div>
			) : (
				<div
					className="grid w-full gap-6"
					style={{
						gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
					}}
				>
					{filteredGames.map((game) => (
						<GameCard key={game.id} {...game} />
					))}
				</div>
			)}
		</div>
	);
}
