import type { Game, SortOption, SortDirection } from "@/@types";

function safeString(str: string | null | undefined) {
	return (str ?? "").toLocaleLowerCase();
}

function safeDate(date: string | Date | null | undefined): number {
	if (!date) return Number.NEGATIVE_INFINITY;
	return typeof date === "string" ? new Date(date).getTime() : date.getTime();
}

export function sortGames(
	games: Game[],
	sort: SortOption = "releaseDate",
	direction: SortDirection = "desc",
): Game[] {
	if (!Array.isArray(games) || games.length <= 1) return games;

	// Attach original index for stable sort
	const withIndex = games.map((g, i) => ({ g, i }));

	withIndex.sort((a, b) => {
		let cmp = 0;

		if (sort === "title") {
			const aTitle = safeString(a.g.title);
			const bTitle = safeString(b.g.title);

			// Empty titles go last
			if (!aTitle && !bTitle) cmp = 0;
			else if (!aTitle) cmp = 1;
			else if (!bTitle) cmp = -1;
			else
				cmp = aTitle.localeCompare(bTitle, undefined, {
					sensitivity: "base",
					numeric: true,
				});
		} else if (sort === "releaseDate") {
			const aTime = safeDate(a.g.releaseDate);
			const bTime = safeDate(b.g.releaseDate);

			// Missing dates go last
			if (aTime === bTime) cmp = 0;
			else if (aTime === Number.NEGATIVE_INFINITY) cmp = 1;
			else if (bTime === Number.NEGATIVE_INFINITY) cmp = -1;
			else cmp = aTime - bTime;
		}

		// Stable sort: if equal, use original index
		if (cmp === 0) cmp = a.i - b.i;

		return direction === "asc" ? cmp : -cmp;
	});

	return withIndex.map((x) => x.g);
}
