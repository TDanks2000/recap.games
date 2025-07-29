"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_YEAR = new Date().getFullYear();
const YEAR_STORAGE_KEY = "recap-games-year-filter";

export function useYearFilter() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const [isInitialized, setIsInitialized] = useState(false);

	// Get year from localStorage or URL, with localStorage taking precedence
	const currentYear = useMemo(() => {
		if (typeof window === "undefined") return DEFAULT_YEAR;

		const urlYear = searchParams.get("year");
		const storedYear = localStorage.getItem(YEAR_STORAGE_KEY);

		// If we have a stored year, use it (unless URL explicitly overrides it)
		if (storedYear && !urlYear) {
			const parsedStoredYear = Number.parseInt(storedYear, 10);
			if (!Number.isNaN(parsedStoredYear)) {
				return parsedStoredYear;
			}
		}

		// Otherwise use URL year or default
		return urlYear ? Number.parseInt(urlYear, 10) : DEFAULT_YEAR;
	}, [searchParams]);

	// Initialize localStorage on mount
	useEffect(() => {
		if (typeof window === "undefined") return;

		const storedYear = localStorage.getItem(YEAR_STORAGE_KEY);
		if (!storedYear) {
			localStorage.setItem(YEAR_STORAGE_KEY, currentYear.toString());
		}
		setIsInitialized(true);
	}, [currentYear]);

	const onYearChange = useCallback(
		(year: number) => {
			// Save to localStorage
			if (typeof window !== "undefined") {
				localStorage.setItem(YEAR_STORAGE_KEY, year.toString());
			}

			// Update URL
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

	return { currentYear, onYearChange, isInitialized };
}
