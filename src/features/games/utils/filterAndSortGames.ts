import type { Game, HomeSearchParams } from "@/@types";
import { sortGames } from "@/lib";

export function filterAndSortGames(
	games: Game[],
	searchParams: HomeSearchParams,
): Game[] {
	// Parse selected conference IDs
	const selectedConferences = (searchParams.conferences ?? "")
		.split(",")
		.map((s) => Number(s))
		.filter((n) => !Number.isNaN(n) && n > 0);

	// Filter by selected conferences
	let filteredGames = games.filter(
		(g) =>
			selectedConferences.length === 0 ||
			(g.conferenceId && selectedConferences.includes(g.conferenceId)),
	);

	// Filter by search string
	const search = searchParams.search?.toLowerCase() ?? "";
	if (search.length > 0) {
		filteredGames = filteredGames.filter((g) => {
			const title = g.title?.toLowerCase() ?? "";
			// If conference is null/undefined, treat as "upcoming"
			const conferenceName = g.conference?.name?.toLowerCase() ?? "upcoming";
			return title.includes(search) || conferenceName.includes(search);
		});
	}

	// Sort
	const sort = searchParams.sort ?? "releaseDate";
	const direction = searchParams.direction ?? "desc";
	filteredGames = sortGames(filteredGames, sort, direction);

	return filteredGames;
}
