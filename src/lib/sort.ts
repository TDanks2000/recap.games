import type { Game, SortDirection, SortOption } from "@/@types";

function safeString(str: string | null | undefined): string {
	return (str ?? "").toLocaleLowerCase();
}

const TBA_SORT_KEY = Number.POSITIVE_INFINITY - 1;
const MISSING_DATE_SORT_KEY = Number.POSITIVE_INFINITY;

function safeDate(date: string | Date | null | undefined): number {
	if (date === null || date === undefined) {
		return MISSING_DATE_SORT_KEY;
	}
	if (typeof date === "string") {
		if (date.toLocaleUpperCase() === "TBA") {
			return TBA_SORT_KEY;
		}
		const parsedDate = new Date(date);
		const time = parsedDate.getTime();
		return Number.isNaN(time) ? MISSING_DATE_SORT_KEY : time;
	}
	const time = date.getTime();
	return Number.isNaN(time) ? MISSING_DATE_SORT_KEY : time;
}

export function sortGames(
	games: Game[],
	sort: SortOption = "releaseDate",
	direction: SortDirection = "desc",
): Game[] {
	if (!Array.isArray(games) || games.length <= 1) return games;

	const withIndex = games.map((g, i) => ({ g, i }));

	withIndex.sort((a, b) => {
		let cmp = 0;

		if (sort === "title") {
			const aTitle = safeString(a.g.title);
			const bTitle = safeString(b.g.title);

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
			cmp = aTime - bTime;
		} else if (sort === "date_added") {
			const aTime = safeDate(a.g.createdAt);
			const bTime = safeDate(b.g.createdAt);
			cmp = aTime - bTime;
		}

		if (cmp === 0) cmp = a.i - b.i;

		return direction === "asc" ? cmp : -cmp;
	});

	return withIndex.map((x) => x.g);
}
