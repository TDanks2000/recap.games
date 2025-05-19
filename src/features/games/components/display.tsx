import { Gamepad2 } from "lucide-react";
import { Suspense } from "react";
import type { HomeSearchParams, PaginationOptions } from "@/@types";
import { ConferenceFilterSkeleton } from "@/components/skeletons/conference-filter-skeleton";
import { GamesSortSkeleton } from "@/components/skeletons/games-sort-skeleton";
import { sortGames } from "@/lib";
import { api } from "@/trpc/server";
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

	// parse selected conference IDs from searchParams
	const selectedConferences = (searchParams.conferences ?? "")
		.split(",")
		.map((s) => Number(s))
		.filter((n) => !Number.isNaN(n) && n > 0);

	let filteredGames = games.filter(
		(g) =>
			selectedConferences.length === 0 ||
			(g.conferenceId && selectedConferences.includes(g.conferenceId)),
	);

	const sort = searchParams.sort ?? "releaseDate";
	const direction = searchParams.direction ?? "desc";
	filteredGames = sortGames(filteredGames, sort, direction);

	return (
		<div className="flex size-full flex-col gap-6 px-2 sm:px-0">
			{/* Header */}
			<div className="flex flex-col items-start justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
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
				<div className="col-span-full flex flex-col items-center justify-center gap-4 rounded-xl bg-muted/50 py-12 text-center">
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
				<div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{filteredGames.map((game) => (
						<GameCard key={game.id} {...game} />
					))}
				</div>
			)}
		</div>
	);
}
