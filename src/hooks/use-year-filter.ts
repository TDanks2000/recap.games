"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const DEFAULT_YEAR = new Date().getFullYear();

export function useYearFilter() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const currentYear = useMemo(() => {
		const year = searchParams.get("year");
		return year ? Number.parseInt(year, 10) : DEFAULT_YEAR;
	}, [searchParams]);

	const onYearChange = useCallback(
		(year: number) => {
			const params = new URLSearchParams(searchParams.toString());
			if (year === DEFAULT_YEAR) {
				params.delete("year");
			} else {
				params.set("year", year.toString());
			}
			router.replace(`${pathname}?${params.toString()}`);
		},
		[searchParams, router, pathname],
	);

	return { currentYear, onYearChange };
}
