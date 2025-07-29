"use client";

import { useEffect, useId } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useYearFilter } from "@/hooks/use-year-filter";
import { api } from "@/trpc/react";

export default function YearFilter() {
	const { currentYear, onYearChange, isInitialized } = useYearFilter();
	const { data: availableYears, isLoading } =
		api.combined.getAvailableYears.useQuery(undefined, {
			suspense: true,
			enabled: isInitialized, // Only run query after localStorage is initialized
		});

	// Fallback to current year if no data available
	const years = availableYears || [new Date().getFullYear()];

	// Auto-redirect to first available year if current year is not available
	useEffect(() => {
		if (!isInitialized) return; // Don't redirect until initialized

		if (
			availableYears &&
			availableYears.length > 0 &&
			!availableYears.includes(currentYear)
		) {
			const firstAvailableYear = availableYears[0];
			if (firstAvailableYear !== undefined) {
				onYearChange(firstAvailableYear);
			}
		}
	}, [availableYears, currentYear, onYearChange, isInitialized]);

	return (
		<Select
			value={isInitialized ? currentYear.toString() : ""}
			onValueChange={(val) => onYearChange(Number.parseInt(val, 10))}
			disabled={isLoading || !isInitialized}
		>
			<SelectTrigger
				id={useId()}
				className="w-[90px]"
				name="year filter"
				aria-label="Filter by year"
			>
				<SelectValue placeholder={isInitialized ? "Year" : "Loading..."} />
			</SelectTrigger>
			<SelectContent align="end">
				{years.map((year) => (
					<SelectItem key={year} value={year.toString()}>
						{year}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
