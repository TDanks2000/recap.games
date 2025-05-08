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
