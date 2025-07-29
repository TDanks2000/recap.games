import type { HomeSearchParams } from "@/@types";
import type { RouterOutputs } from "@/trpc/react";

export type Conference = RouterOutputs["conference"]["getAll"][number];
const getStart = (c: Conference): number | null =>
	c.startTime ? new Date(c.startTime).getTime() : null;

const getEnd = (c: Conference): number | null =>
	c.endTime ? new Date(c.endTime).getTime() : null;

const getSortKey = (c: Conference): [number, number] => {
	const now = Date.now();
	const start = getStart(c);
	const end = getEnd(c);

	if (start !== null && start <= now && (end === null || end > now)) {
		return [0, start];
	}

	if (start !== null && start > now) {
		return [1, start];
	}

	if (end !== null && end <= now) {
		return [2, -end];
	}

	return [3, 0];
};

export function sortConferences(conferences: Conference[]): Conference[] {
	return conferences.slice().sort((a, b) => {
		const [aCat, aTime] = getSortKey(a);
		const [bCat, bTime] = getSortKey(b);

		if (aCat !== bCat) return aCat - bCat;
		return aTime - bTime;
	});
}

export function filterAndSortConferences(
	conferences: Conference[],
	searchParams: HomeSearchParams,
): Conference[] {
	const search = searchParams.search?.toLowerCase() ?? "";
	const yearFilter = searchParams.year
		? Number.parseInt(searchParams.year, 10)
		: new Date().getFullYear();

	let filtered = conferences;

	// Filter by year
	filtered = filtered.filter((conf) => conf.year === yearFilter);

	if (search.length > 0) {
		filtered = filtered.filter((conf) =>
			conf.name?.toLowerCase().includes(search),
		);
	}

	return sortConferences(filtered);
}
