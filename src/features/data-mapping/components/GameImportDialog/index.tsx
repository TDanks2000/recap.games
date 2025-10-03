"use client";

import { useState } from "react";
import { MultiStepDialog } from "@/components/multi-step-dialog";
import type { GameFormInitialData } from "@/features/admin/components/GameForm";
import { GameReviewStep } from "./GameReviewStep";
import { GameSearchStep } from "./GameSearchStep";

interface GameImportDialogProps {
	isOpen: boolean;
	onClose: () => void;
	preData?: GameFormInitialData | undefined;
	initalQuery?: string | undefined;
}

export function GameImportDialog({
	isOpen,
	onClose,
	preData,
	initalQuery,
}: GameImportDialogProps) {
	const [initialData, setInitialData] = useState<
		GameFormInitialData | undefined
	>(preData);
	const [searchQuery, setSearchQuery] = useState<string>(initalQuery ?? "");
	const [selectedGame, setSelectedGame] = useState<number | null>(null);
	const [selectedType, setSelectedType] = useState<"igdb" | "steam">();
	const [steamOpen, setSteamOpen] = useState(true);
	const [igdbOpen, setIgdbOpen] = useState(true);

	const resetToDefaults = () => {
		setInitialData(undefined);
		setSearchQuery("");
		setSelectedGame(null);
		setSelectedType(undefined);
		setSteamOpen(true);
		setIgdbOpen(true);
	};

	const handleClose = () => {
		resetToDefaults();
		onClose();
	};

	return (
		<MultiStepDialog
			isOpen={isOpen}
			onClose={handleClose}
			dialogContentClassName="min-w-[calc(100svw-7rem)] min-h-[calc(100svh-7rem)] max-w-[calc(100svw-7rem)] max-h-[calc(100svh-7rem)]"
			steps={[
				{
					title: "Search for Game",
					description: "Search external APIs to import game data automatically",
					component: (
						<GameSearchStep
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							selectedGame={selectedGame}
							setSelectedGame={setSelectedGame}
							setSelectedType={setSelectedType}
							steamOpen={steamOpen}
							setSteamOpen={setSteamOpen}
							igdbOpen={igdbOpen}
							setIgdbOpen={setIgdbOpen}
						/>
					),
				},
				{
					title: "Review & Edit Game Details",
					description:
						"Review the imported data and make any necessary adjustments",
					component: (
						<GameReviewStep
							initialData={initialData}
							conference={preData?.conference}
							setInitialData={setInitialData}
							selectedGame={selectedGame}
							selectedType={selectedType}
						/>
					),
				},
			]}
		/>
	);
}
