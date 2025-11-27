"use client";

import { useCallback, useMemo } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { useConferenceFilter } from "@/hooks/use-conference-filter";
import { useYearFilter } from "@/hooks/use-year-filter";
import { getFormattedDate } from "@/lib";
import { api } from "@/trpc/react";

export default function ConferenceFilterClient() {
	const { selectedConferences, onConferenceChange } = useConferenceFilter();
	const { currentYear, isInitialized } = useYearFilter();
	const { data: conferences, isError } = api.conference.getAll.useQuery(
		{ year: currentYear, withGames: true },
		{
			suspense: true,
			enabled: isInitialized,
		},
	);

	// Memoize sorted conferences to avoid re-sorting on every render
	const sortedConferences = useMemo(() => {
		if (!conferences?.length) return [];

		return [...conferences].sort((a, b) => {
			if (a.startTime && b.startTime) {
				return (
					new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
				);
			}
			return 0;
		});
	}, [conferences]);

	// Memoize options to avoid recreating on every render
	const options = useMemo(() => {
		return sortedConferences.map((c) => {
			const gameCount = c.games?.length ?? 0;
			return {
				label: c.name,
				value: c.id.toString(),
				description: [
					c.startTime ? getFormattedDate(c.startTime) : undefined,
					gameCount > 0
						? `${gameCount} game${gameCount === 1 ? "" : "s"}`
						: undefined,
				],
				disabled: gameCount === 0,
			};
		});
	}, [sortedConferences]);

	// Memoize the onChange handler to avoid recreating on every render
	const handleConferenceChange = useCallback(
		(vals: string[]) => {
			onConferenceChange(vals.map(Number));
		},
		[onConferenceChange],
	);

	// Memoize selected values as strings to avoid re-mapping on every render
	const selectedAsStrings = useMemo(
		() => selectedConferences.map(String),
		[selectedConferences],
	);

	if (!isInitialized || isError || !conferences?.length) return null;

	return (
		<div className="w-full sm:w-[260px]">
			<MultiSelect
				options={options}
				selected={selectedAsStrings}
				onChange={handleConferenceChange}
				placeholder="Filter by Conference"
				optionsGroupLabel="Conferences"
				enableDebounce={true}
				debounceMs={1500}
			/>
		</div>
	);
}
