import { api } from "@/trpc/react";

type DataSource = "igdb" | "steam";

interface UseGameDetailsProps {
	gameId: number;
	source: DataSource | undefined;
}

/**
 * Hook to fetch detailed game information from IGDB or Steam
 * @param gameId - The ID of the game to fetch
 * @param source - The data source to use ("igdb" or "steam")
 * @returns Game details data, loading states, and error information
 */
export const useGameDetails = ({ gameId, source }: UseGameDetailsProps) => {
	// Check if we should enable queries
	const isEnabled = gameId !== null && source !== undefined;
	const shouldFetchIgdb = isEnabled && source === "igdb";
	const shouldFetchSteam = isEnabled && source === "steam";

	// Fetch IGDB data
	const {
		data: igdbData,
		isLoading: isLoadingIgdb,
		error: errorIgdb,
	} = api.igdb.info.useQuery(
		{ id: gameId?.toString() },
		{
			enabled: shouldFetchIgdb,
		},
	);

	// Fetch Steam data
	const {
		data: steamData,
		isLoading: isLoadingSteam,
		error: errorSteam,
	} = api.steam.getAppDetails.useQuery(
		{ appid: gameId },
		{
			enabled: shouldFetchSteam,
		},
	);

	// Determine which data is active based on source
	const activeData =
		source === "igdb" ? igdbData : source === "steam" ? steamData : undefined;

	// Combined loading state
	const isLoading = isLoadingIgdb || isLoadingSteam;

	// Combined error state
	const error = errorIgdb || errorSteam;

	// Check if we have data
	const hasData = activeData !== undefined;

	return {
		// Raw data from each source
		igdbData,
		steamData,

		// Active data based on selected source
		data: activeData,

		// Loading states
		isLoading,
		isLoadingIgdb,
		isLoadingSteam,

		// Error states
		error,
		errorIgdb,
		errorSteam,

		// Utility flags
		hasData,
		isEnabled,
		source,
	};
};
