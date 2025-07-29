"use client";

import { MultiSelect } from "@/components/ui/multi-select";
import { useConferenceFilter } from "@/hooks/use-conference-filter";
import { useYearFilter } from "@/hooks/use-year-filter";
import { api } from "@/trpc/react";

export default function ConferenceFilterClient() {
	const { selectedConferences, onConferenceChange } = useConferenceFilter();
	const { currentYear, isInitialized } = useYearFilter();
	const { data: conferences, isError } = api.conference.getAll.useQuery(
		{ year: currentYear },
		{
			suspense: true,
			enabled: isInitialized, // Only run query after year filter is initialized
		},
	);

	if (!isInitialized || isError || !conferences?.length) return null;

	const options = conferences.map((c) => ({
		label: c.name,
		value: c.id.toString(),
	}));

	return (
		<div className="w-full sm:w-[260px]">
			<MultiSelect
				options={options}
				selected={selectedConferences.map(String)}
				onChange={(vals) => onConferenceChange(vals.map(Number))}
				placeholder="Filter by Conference"
			/>
		</div>
	);
}
