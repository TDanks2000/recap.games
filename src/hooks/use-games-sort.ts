"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export type SortOption = "title" | "releaseDate";
export type SortDirection = "asc" | "desc";

export function useGamesSort() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const currentSort = useMemo(() => {
		const sort = searchParams.get("sort") as SortOption;
		return sort || "releaseDate";
	}, [searchParams]);

	const currentDirection = useMemo(() => {
		const direction = searchParams.get("direction") as SortDirection;
		return direction || "desc";
	}, [searchParams]);

	const onSortChange = useCallback(
		(sortOption: SortOption, direction?: SortDirection) => {
			const params = new URLSearchParams(searchParams.toString());

			if (sortOption && sortOption !== "releaseDate") {
				params.set("sort", sortOption);
			} else {
				params.delete("sort");
			}

			if (direction) {
				if (direction !== "desc") {
					params.set("direction", direction);
				} else {
					params.delete("direction");
				}
			}

			router.replace(`${pathname}?${params.toString()}`);
		},
		[searchParams, router, pathname],
	);

	const toggleDirection = useCallback(() => {
		const newDirection = currentDirection === "asc" ? "desc" : "asc";
		onSortChange(currentSort, newDirection);
	}, [currentDirection, currentSort, onSortChange]);

	return { currentSort, currentDirection, onSortChange, toggleDirection };
}
