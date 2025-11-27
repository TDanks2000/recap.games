import { AlertTriangle, ArrowRight, Gamepad2 } from "lucide-react";
import Link from "next/link";
import type { HomeSearchParams } from "@/@types";
import { RetryButton } from "@/components/RetryButton";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/lib/try-catch";
import { getYearFromSearchParams } from "@/lib/utils";
import { api } from "@/trpc/server";
import GameCardDialog from "../cards/game-dialog";
import { PaginationControls } from "./PaginationControls";

type GamesListProps = {
	searchParams: HomeSearchParams;
};

export async function GamesList({ searchParams }: GamesListProps) {
	const page = Number(searchParams.page ?? 1);
	const year = getYearFromSearchParams(searchParams);
	const limit = 20;

	const { data: gamesResponse, error } = await tryCatch(
		api.game.getAll({
			page,
			limit,
			conferenceIds: searchParams.conferences,
			search: searchParams.search,
			sort: searchParams.sort,
			direction: searchParams.direction,
			year,
		}),
	);

	if (error) {
		return (
			<div className="col-span-full flex w-full flex-col items-center justify-center gap-6 rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-16 text-center">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
					<AlertTriangle className="h-8 w-8 text-destructive" />
				</div>
				<div className="space-y-2">
					<h3 className="font-bold text-destructive text-xl">
						Failed to Load Games
					</h3>
					<p className="mx-auto max-w-md text-muted-foreground text-sm">
						{error.message ||
							"Something went wrong while loading the games. Please try again."}
					</p>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row">
					<RetryButton />
					<Button variant="outline" size="sm" asChild>
						<Link href="/">Go Home</Link>
					</Button>
				</div>
			</div>
		);
	}

	const games = gamesResponse?.items ?? [];
	const totalGames = gamesResponse?.totalItems ?? 0;
	const totalPages = gamesResponse?.totalPages ?? 1;
	const currentPage = gamesResponse?.currentPage ?? 1;

	if (games.length === 0 || !gamesResponse) {
		const hasFilters =
			(searchParams.conferences?.length ?? 0) > 0 ||
			(searchParams.search?.length ?? 0) > 0 ||
			searchParams.year;

		return (
			<div className="col-span-full flex w-full flex-col items-center justify-center gap-6 rounded-xl bg-muted/30 px-6 py-16 text-center">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
					<Gamepad2 className="h-8 w-8 text-muted-foreground" />
				</div>
				<div className="space-y-2">
					<h3 className="font-bold text-foreground text-xl">No Games Found</h3>
					<p className="mx-auto max-w-md text-muted-foreground text-sm">
						{hasFilters
							? "We couldn't find any games matching your criteria. Try adjusting your filters, search terms, or year selection."
							: "No games are currently available. Check back soon for new releases!"}
					</p>
				</div>
				{hasFilters && (
					<Button variant="outline" size="sm" asChild>
						<Link href="/">Clear All Filters</Link>
					</Button>
				)}
				<div className="mt-4 rounded-lg border border-border bg-card p-4">
					<p className="mb-3 text-muted-foreground text-sm">
						Looking for previous years?
					</p>
					<Button variant="secondary" size="sm" asChild className="gap-2">
						<a
							href="https://old.recap.games/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Visit Archive
							<ArrowRight className="h-4 w-4" />
						</a>
					</Button>
				</div>
			</div>
		);
	}

	// Calculate range for results display
	const startIndex = (currentPage - 1) * limit + 1;
	const endIndex = Math.min(currentPage * limit, totalGames);

	return (
		<div className="space-y-2">
			{/* Results Summary */}
			<div className="flex items-center justify-between pb-2">
				<p className="text-muted-foreground text-sm">
					Showing{" "}
					<span className="font-medium text-foreground">{startIndex}</span>
					{" - "}
					<span className="font-medium text-foreground">{endIndex}</span>
					{" of "}
					<span className="font-medium text-foreground">{totalGames}</span>{" "}
					{totalGames === 1 ? "game" : "games"}
				</p>
			</div>

			{/* Games Grid */}
			<div className="grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
				{games.map((game, index) => (
					<GameCardDialog key={game.id} {...game} priority={index < 4} />
				))}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex w-full justify-center pt-6">
					<PaginationControls
						totalPages={totalPages}
						currentPage={currentPage}
					/>
				</div>
			)}
		</div>
	);
}
