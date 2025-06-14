import { Gamepad2 } from "lucide-react";
import type { HomeSearchParams } from "@/@types";
import { api } from "@/trpc/server";
import GameCard from "../cards/game";
import { PaginationControls } from "./PaginationControls";

type GamesListProps = {
	searchParams: HomeSearchParams;
};

export async function GamesList({ searchParams }: GamesListProps) {
	const page = Number(searchParams.page ?? 1);

	const gamesResponse = await api.game.getAll({
		page,
		limit: 20,
		conferenceIds: searchParams.conferences,
		search: searchParams.search,
		sort: searchParams.sort,
		direction: searchParams.direction,
	});

	const games = gamesResponse?.items ?? [];

	if (games.length === 0) {
		const hasFilters =
			(searchParams.conferences?.length ?? 0) > 0 ||
			(searchParams.search?.length ?? 0) > 0;

		return (
			<div className="col-span-full flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-muted/50 py-12 text-center">
				<Gamepad2 className="h-12 w-12 text-muted-foreground" />
				<h3 className="font-semibold text-xl">No Games Found</h3>
				<p className="text-muted-foreground text-sm">
					{hasFilters
						? "Try adjusting your search or conference filters."
						: "Check back later for new games."}
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
		);
	}

	return (
		<>
			<div
				className="grid w-full gap-6"
				style={{
					gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
				}}
			>
				{games.map((game, index) => (
					<GameCard key={game.id} {...game} priority={index < 4} />
				))}
			</div>
			<div className="mt-6 flex w-full justify-center">
				<PaginationControls
					totalPages={gamesResponse.totalPages}
					currentPage={gamesResponse.currentPage}
				/>
			</div>
		</>
	);
}
