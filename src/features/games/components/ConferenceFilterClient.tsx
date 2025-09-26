"use client";

import { MultiSelect } from "@/components/ui/multi-select";
import { useConferenceFilter } from "@/hooks/use-conference-filter";
import { useYearFilter } from "@/hooks/use-year-filter";
import { getFormattedDate } from "@/lib";
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

	const sortedConferences = conferences.sort((a, b) => {
		if (a.startTime && b.startTime) {
			return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
		}
		return 0;
	});

	const options = sortedConferences.map((c) => ({
		label: c.name,
		value: c.id.toString(),
		description: c.startTime ? getFormattedDate(c.startTime) : undefined,
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
