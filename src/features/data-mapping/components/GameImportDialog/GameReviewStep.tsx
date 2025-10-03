"use client";

import { AlertCircle, Info, Loader2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GameForm, {
	type GameFormInitialData,
} from "@/features/admin/components/GameForm";
import { SearchEmptyState } from "@/features/data-mapping/components/SearchEmptyState";
import { useGameDetails } from "@/features/data-mapping/hooks/useInfoDataApis";
import type { RouterOutputs } from "@/trpc/react";
import { mapGameDataToForm } from "../../lib/gameFormMapper";

interface GameReviewStepProps {
	initialData: GameFormInitialData | undefined;
	setInitialData: Dispatch<SetStateAction<GameFormInitialData | undefined>>;
	selectedGame: number | null;
	selectedType: "igdb" | "steam" | undefined;
	updateMedia?: boolean;
}

type IGDBInfo = NonNullable<RouterOutputs["igdb"]["info"]>;
type SteamInfo = NonNullable<RouterOutputs["steam"]["getAppDetails"]>;

const isSteamData = (game: IGDBInfo | SteamInfo): game is SteamInfo => {
	return !!game && "success" in game;
};

export function GameReviewStep({
	initialData,
	setInitialData,
	selectedGame,
	selectedType,
	updateMedia = true,
}: GameReviewStepProps) {
	const { data, isLoading, error, hasData } = useGameDetails({
		gameId: selectedGame ?? -1,
		source: selectedType,
	});

	// Memoize the transformed data using the mapper
	const transformedData = useMemo(() => {
		if (!data || !hasData) return null;

		const mapped = mapGameDataToForm(data);
		const source = isSteamData(data) ? "Steam" : "IGDB";

		return {
			...mapped,
			source,
		};
	}, [data, hasData]);

	// Update initialData when game details are fetched
	useEffect(() => {
		if (transformedData) {
			// biome-ignore lint/correctness/noUnusedVariables: this is fine as we are just removing the source from the data
			const { source, media, ...rest } = transformedData;

			setInitialData((prev) => ({
				...prev,
				...rest,
				// Only include media if updateMedia is true
				...(updateMedia && media ? { media } : {}),
			}));
		}
	}, [transformedData, setInitialData, updateMedia]);

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<SearchEmptyState
					icon={Loader2}
					title="Loading game details..."
					subtitle="Fetching complete information from API"
					iconClassName="animate-spin"
				/>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-full items-center justify-center p-8">
				<div className="w-full max-w-md space-y-4">
					<SearchEmptyState
						icon={AlertCircle}
						title="Error loading game details"
						subtitle={error.message || "Please try again"}
					/>
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>
							{selectedType === "steam"
								? "Failed to fetch game details from Steam. The game may not be available or the API may be experiencing issues."
								: "Failed to fetch game details from IGDB. Please check your connection and try again."}
						</AlertDescription>
					</Alert>
				</div>
			</div>
		);
	}

	if (!hasData || !transformedData) {
		return (
			<div className="flex h-full items-center justify-center">
				<SearchEmptyState
					icon={AlertCircle}
					title="No game data available"
					subtitle="Please select a game from the previous step"
				/>
			</div>
		);
	}

	return (
		<div className="flex size-full flex-col gap-4 overflow-y-auto">
			{/* Info banner about data source */}
			<Alert>
				<Info className="h-4 w-4 shrink-0" />
				<AlertDescription className="flex items-center gap-1">
					Game data imported from <strong>{transformedData.source}</strong>.
					Review and edit the information below before saving.
					{!updateMedia && (
						<span className="ml-1 text-muted-foreground">
							(Media will not be updated)
						</span>
					)}
				</AlertDescription>
			</Alert>

			{/* Game Form */}
			<div className="flex-1">
				<GameForm formIndex={1} initialData={initialData} />
			</div>

			{/* Optional: Debug info in development */}
			{process.env.NODE_ENV === "development" && transformedData && (
				<details className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-xs">
					<summary className="cursor-pointer font-semibold text-gray-400">
						Debug: Transformed Data
					</summary>
					<pre className="mt-2 overflow-auto text-gray-500">
						{JSON.stringify(transformedData, null, 2)}
					</pre>
				</details>
			)}
		</div>
	);
}
