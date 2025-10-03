"use client";

import { Database, Loader2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { GameFormInitialData } from "@/features/admin/components/GameForm";
import { DataSourceSection } from "@/features/data-mapping/components/DataSourceSection";
import { SearchEmptyState } from "@/features/data-mapping/components/SearchEmptyState";
import { SearchInput } from "@/features/data-mapping/components/SearchInput";
import { SelectableGameCard } from "@/features/data-mapping/components/SelectableGameCard";
import { useSearchDataApis } from "@/features/data-mapping/hooks/useSearchDataApis";

interface GameSearchStepProps {
	searchQuery: string;
	setSearchQuery: Dispatch<SetStateAction<string>>;
	selectedGame: number | null;
	setSelectedGame: Dispatch<SetStateAction<number | null>>;
	setInitialData: Dispatch<SetStateAction<GameFormInitialData | undefined>>;
	steamOpen: boolean;
	setSteamOpen: Dispatch<SetStateAction<boolean>>;
	igdbOpen: boolean;
	setIgdbOpen: Dispatch<SetStateAction<boolean>>;
	setSelectedType: Dispatch<SetStateAction<"igdb" | "steam" | undefined>>;
}

export function GameSearchStep({
	searchQuery,
	setSearchQuery,
	selectedGame,
	setSelectedGame,
	setInitialData,
	steamOpen,
	setSteamOpen,
	igdbOpen,
	setIgdbOpen,
	setSelectedType,
}: GameSearchStepProps) {
	const { steamData, igdbData, isAnyLoading, errorSteam, errorIgdb } =
		useSearchDataApis({
			query: searchQuery,
			debounceMs: 1000,
		});

	const hasError = errorSteam || errorIgdb;
	const hasSearched = searchQuery.length > 0;
	const hasSteamResults = steamData && steamData.length > 0;
	const hasIgdbResults = igdbData && igdbData.length > 0;
	const hasAnyResults = hasSteamResults || hasIgdbResults;
	const showEmptyState =
		hasSearched && !isAnyLoading && !hasAnyResults && !hasError;

	return (
		<div className="flex h-full flex-1 flex-col justify-start gap-4 overflow-hidden">
			<div className="shrink-0">
				<SearchInput
					value={searchQuery}
					onChange={setSearchQuery}
					placeholder="Enter game title to search..."
				/>
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto">
				{isAnyLoading && (
					<SearchEmptyState
						icon={Loader2}
						title="Searching for games..."
						iconClassName="animate-spin"
					/>
				)}

				{!hasSearched && !isAnyLoading && (
					<SearchEmptyState
						icon={Database}
						title="Enter a game title to search"
					/>
				)}

				{hasError && (
					<SearchEmptyState
						icon={Database}
						title="Error searching for games"
						subtitle={
							errorSteam?.message || errorIgdb?.message || "Please try again"
						}
					/>
				)}

				{showEmptyState && (
					<SearchEmptyState
						icon={Database}
						title={`No games found for "${searchQuery}"`}
						subtitle="Try a different search term"
					/>
				)}

				{hasAnyResults && !isAnyLoading && (
					<ScrollArea className="h-full">
						<div className="space-y-3 pr-4">
							{hasSteamResults && (
								<DataSourceSection
									sourceName="Steam"
									sourceColor="blue"
									resultCount={steamData?.length || 0}
									isOpen={steamOpen}
									onOpenChange={setSteamOpen}
								>
									{steamData?.map((game) => (
										<SelectableGameCard
											key={game.id}
											game={game}
											isSelected={selectedGame === game.id}
											onSelect={(id) => {
												setSelectedGame(id);
												setSelectedType("steam");
												setInitialData({
													title: game.name,
												});
											}}
										/>
									))}
								</DataSourceSection>
							)}

							{hasIgdbResults && (
								<DataSourceSection
									sourceName="IGDB"
									sourceColor="purple"
									resultCount={igdbData?.length || 0}
									isOpen={igdbOpen}
									onOpenChange={setIgdbOpen}
								>
									{igdbData?.map((game) => (
										<SelectableGameCard
											key={game.id}
											game={game}
											isSelected={selectedGame === game.id}
											onSelect={(id) => {
												setSelectedGame(id);
												setSelectedType("igdb");
												setInitialData({
													title: game.name,
												});
											}}
										/>
									))}
								</DataSourceSection>
							)}
						</div>
					</ScrollArea>
				)}
			</div>
		</div>
	);
}
