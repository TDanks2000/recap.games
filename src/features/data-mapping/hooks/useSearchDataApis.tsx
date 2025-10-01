import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

type UseSearchDataApisDisabled = "steam" | "igdb";

interface UseSearchDataApisProps {
	query: string;
	disabled?: Array<UseSearchDataApisDisabled>;
	debounceMs?: number;
	minQueryLength?: number;
}

export const useSearchDataApis = ({
	query,
	disabled = [],
	debounceMs = 500,
	minQueryLength = 2,
}: UseSearchDataApisProps) => {
	const [debouncedQuery, setDebouncedQuery] = useState(query);

	// Debounce the query
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
		}, debounceMs);

		return () => {
			clearTimeout(handler);
		};
	}, [query, debounceMs]);

	// Check if query is valid for searching
	const shouldSearch = debouncedQuery.trim().length >= minQueryLength;

	const {
		data: steamData,
		isLoading: isLoadingSteam,
		error: errorSteam,
	} = api.steam.searchStore.useQuery(
		{ query: debouncedQuery },
		{
			enabled: shouldSearch && !disabled.includes("steam"),
		},
	);

	const {
		data: igdbData,
		isLoading: isLoadingIgdb,
		error: errorIgdb,
	} = api.igdb.search.useQuery(
		{ query: debouncedQuery },
		{
			enabled: shouldSearch && !disabled.includes("igdb"),
		},
	);

	// Determine if we're still debouncing (user is typing)
	const isDebouncing = query !== debouncedQuery;

	// Generic states for all apis
	const isAnyLoading = isLoadingSteam || isLoadingIgdb;

	return {
		steamData,
		isLoadingSteam: isLoadingSteam || (isDebouncing && shouldSearch),
		errorSteam,
		igdbData,
		isLoadingIgdb: isLoadingIgdb || (isDebouncing && shouldSearch),
		errorIgdb,
		debouncedQuery,
		isDebouncing,
		isAnyLoading,
	};
};
