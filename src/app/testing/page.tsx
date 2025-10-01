"use client";

import { Database, Loader2 } from "lucide-react";
import { useState } from "react";
import { MultiStepDialog } from "@/components/multi-step-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import GameForm, {
	type GameFormInitialData,
} from "@/features/admin/components/GameForm";
import { DataSourceSection } from "@/features/data-mapping/components/DataSourceSection";
import { SearchEmptyState } from "@/features/data-mapping/components/SearchEmptyState";
import { SearchInput } from "@/features/data-mapping/components/SearchInput";
import { SelectableGameCard } from "@/features/data-mapping/components/SelectableGameCard";
import { useSearchDataApis } from "@/features/data-mapping/hooks/useSearchDataApis";

export default function TestingPage() {
	const [intialData, setInitalData] = useState<GameFormInitialData>();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedGame, setSelectedGame] = useState<number | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [steamOpen, setSteamOpen] = useState(true);
	const [igdbOpen, setIgdbOpen] = useState(true);

	const { steamData, igdbData, isAnyLoading, errorSteam, errorIgdb } =
		useSearchDataApis({
			query: searchQuery,
			debounceMs: 1000,
		});

	const hasError = errorSteam || errorIgdb;

	const resetToDefaults = () => {
		setInitalData(undefined);
		setSearchQuery("");
		setSelectedGame(null);
		setIsDialogOpen(false);
		setSteamOpen(true);
		setIgdbOpen(true);
	};

	const hasSearched = searchQuery.length > 0;
	const hasSteamResults = steamData && steamData.length > 0;
	const hasIgdbResults = igdbData && igdbData.length > 0;
	const hasAnyResults = hasSteamResults || hasIgdbResults;
	const showEmptyState =
		hasSearched && !isAnyLoading && !hasAnyResults && !hasError;

	return (
		<div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
			<h1 className="mb-5 font-bold text-2xl text-white sm:text-3xl">
				Testing Page
			</h1>

			<Button
				onClick={() => {
					setIsDialogOpen((prev) => !prev);
				}}
			>
				Open Dialog
			</Button>

			<div>
				<MultiStepDialog
					isOpen={isDialogOpen}
					onClose={() => {
						resetToDefaults();
					}}
					dialogContentClassName="min-w-[calc(100svw-7rem)] min-h-[calc(100svh-7rem)] max-w-[calc(100svw-7rem)] max-h-[calc(100svh-7rem)]"
					steps={[
						{
							title: "Search for Game",
							description:
								"Search external APIs to import game data automatically",
							component: (
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
													errorSteam?.message ||
													errorIgdb?.message ||
													"Please try again"
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
																	setSelectedGame={(id) => {
																		setSelectedGame(id);
																		setInitalData({
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
																	setSelectedGame={(id) => {
																		setSelectedGame(id);
																		setInitalData({
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
							),
						},
						{
							title: "Review & Edit Game Details",
							description:
								"Review the imported data and make any necessary adjustments",
							component: (
								<div className="size-full overflow-y-auto">
									<GameForm formIndex={1} initialData={intialData} />
								</div>
							),
						},
					]}
				/>
			</div>
		</div>
	);
}
