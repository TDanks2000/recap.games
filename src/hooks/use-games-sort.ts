"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { SortDirection, SortOption } from "@/@types";

const DEFAULT_SORT_OPTION: SortOption = "date_added";
const DEFAULT_SORT_DIRECTION: SortDirection = "desc";

export function useGamesSort() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const currentSort = useMemo(() => {
		const sort = searchParams.get("sort") as SortOption;
		return sort || DEFAULT_SORT_OPTION;
	}, [searchParams]);

	const currentDirection = useMemo(() => {
		const direction = searchParams.get("direction") as SortDirection;
		return direction || DEFAULT_SORT_DIRECTION;
	}, [searchParams]);

	const onSortChange = useCallback(
		(newSortToApply: SortOption, newDirectionToApply?: SortDirection) => {
			const params = new URLSearchParams(searchParams.toString());

			if (newSortToApply === DEFAULT_SORT_OPTION) {
				params.delete("sort");
			} else {
				params.set("sort", newSortToApply);
			}

			if (newDirectionToApply !== undefined) {
				if (newDirectionToApply === DEFAULT_SORT_DIRECTION) {
					params.delete("direction");
				} else {
					params.set("direction", newDirectionToApply);
				}
			}

			router.replace(`${pathname}?${params.toString()}`);
		},
		[searchParams, router, pathname],
	);

	const toggleDirection = useCallback(() => {
		const newDirection =
			currentDirection === "asc"
				? DEFAULT_SORT_DIRECTION
				: ("asc" as SortDirection);
		onSortChange(currentSort, newDirection);
	}, [currentDirection, currentSort, onSortChange]);

	return { currentSort, currentDirection, onSortChange, toggleDirection };
}
