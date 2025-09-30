"use client";

import { Calendar, Check, Gamepad2, Tag } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { MultiStepDialog } from "@/components/multi-step-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GameForm, {
	type GameFormInitialData,
} from "@/features/admin/components/GameForm";
import { cn } from "@/lib";

const GameCard = ({
	game,
	isSelected,
	setSelectedGame,
}: {
	game: any;
	isSelected: boolean;
	setSelectedGame: Dispatch<SetStateAction<number | null>>;
}) => (
	<Card
		// selected={isSelected}
		onClick={() => setSelectedGame(game.id)}
		className={cn({
			"relative border-2 border-primary": isSelected,
		})}
	>
		<CardContent>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="mb-2 flex items-center gap-2">
						<Gamepad2 className="h-4 w-4 text-primary" />
						<h3 className="font-semibold text-lg text-white">{game.title}</h3>
					</div>
					<div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm">
						<div className="flex items-center gap-1">
							<Calendar className="h-3 w-3" />
							<span>{game.date}</span>
						</div>
						<div className="flex items-center gap-1">
							<Tag className="h-3 w-3" />
							<span>{game.genres.join(", ")}</span>
						</div>
					</div>
					{game.rating && (
						<div className="mt-2">
							<span className="rounded-full bg-green-500/20 px-2 py-1 text-green-400 text-xs">
								Rating: {game.rating}
							</span>
						</div>
					)}
				</div>
				{isSelected && (
					<div className="ml-4 flex-shrink-0">
						<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
							<Check className="h-4 w-4 text-white" />
						</div>
					</div>
				)}
			</div>
		</CardContent>
	</Card>
);

const mockSteamGames = [
	{
		id: 1,
		title: "Cyberpunk 2077",
		date: "12/10/2020",
		genres: ["ACTION", "RPG", "OPEN WORLD"],
		platform: "Steam",
	},
	{
		id: 2,
		title: "The Witcher 3",
		date: "05/19/2015",
		genres: ["ACTION", "RPG", "ADVENTURE"],
		platform: "Steam",
	},
];

const mockIGDBGames = [
	{
		id: 3,
		title: "Cyberpunk 2077",
		date: "12/10/2020",
		genres: ["ACTION", "ROLE-PLAYING", "SHOOTER"],
		platform: "IGDB",
		rating: 87,
	},
	{
		id: 4,
		title: "Cyberpunk 2078",
		date: "TBA",
		genres: ["ACTION", "SCI-FI"],
		platform: "IGDB",
		rating: null,
	},
];

export default function TestingPage() {
	const [intialData, setInitalData] = useState<GameFormInitialData>();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedGame, setSelectedGame] = useState<number | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const resetToDefaults = () => {
		setInitalData(undefined);
		setSearchQuery("");
		setSelectedGame(null);
		setIsDialogOpen(false);
	};

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
					dialogContentClassName="min-w-[1200px] min-h-[600px] max-w-[1200px] max-h-[600px]"
					steps={[
						{
							title: "Automatic game creation from external api",
							description: "enter the title you want to search for",
							component: (
								<div className="flex-1 justify-start">
									<Input placeholder="Enter the title you want to search for" />
									<div className="mt-4">
										<div className="mb-3 flex items-center gap-2">
											<h3 className="font-semibold text-lg text-white">
												Steam
											</h3>
											<span className="rounded bg-gray-800 px-2 py-1 text-gray-500 text-xs">
												{mockSteamGames.length} results
											</span>
										</div>
									</div>
									<div className="space-y-3">
										{mockSteamGames.map((game) => (
											<GameCard
												key={game.id}
												game={game}
												isSelected={selectedGame === game.id}
												setSelectedGame={setSelectedGame}
											/>
										))}
									</div>
								</div>
							),
						},
						{
							title: "test",
							component: (
								<div className="my-5 size-full overflow-y-auto">
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
