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
	const { currentYear, onYearChange } = useYearFilter();
	const { data: availableYears, isLoading } =
		api.combined.getAvailableYears.useQuery(undefined, {
			suspense: true,
		});

	// Fallback to current year if no data available
	const years = availableYears || [new Date().getFullYear()];

	// Auto-redirect to first available year if current year is not available
	useEffect(() => {
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
	}, [availableYears, currentYear, onYearChange]);

	return (
		<Select
			value={currentYear.toString()}
			onValueChange={(val) => onYearChange(Number.parseInt(val, 10))}
			disabled={isLoading}
		>
			<SelectTrigger
				id={useId()}
				className="w-[90px]"
				name="year filter"
				aria-label="Filter by year"
			>
				<SelectValue placeholder="Year" />
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
