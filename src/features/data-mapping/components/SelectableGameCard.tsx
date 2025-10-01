import { Calendar, Check, Gamepad2, ImageOff, Star, Tag } from "lucide-react";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib";
import type { RouterOutputs } from "@/trpc/react";

type IGDBSearch = RouterOutputs["igdb"]["search"][number];
type SteamSearch = NonNullable<RouterOutputs["steam"]["searchStore"]>[number];

type SelectGameCardProps = {
	game: IGDBSearch | SteamSearch;
	isSelected: boolean;
	setSelectedGame: Dispatch<SetStateAction<number | null>>;
};

// Type guards
const isIGDBGame = (game: IGDBSearch | SteamSearch): game is IGDBSearch => {
	return "release_dates" in game;
};

const isSteamGame = (game: IGDBSearch | SteamSearch): game is SteamSearch => {
	return "tiny_image" in game;
};

// Helper function to get IGDB image URL
const getIGDBImageUrl = (imageId: string, size = "cover_big"): string => {
	return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
};

// Helper functions for extracting game data
const getImageUrl = (game: IGDBSearch | SteamSearch): string | null => {
	if (isIGDBGame(game)) {
		if (game.cover?.image_id) {
			return getIGDBImageUrl(game.cover.image_id, "cover_small");
		}
		return null;
	}

	if (isSteamGame(game)) {
		return game.tiny_image ?? null;
	}

	return null;
};

const getReleaseDate = (game: IGDBSearch | SteamSearch): string | null => {
	if (isIGDBGame(game)) {
		return game.release_dates?.[0]?.human ?? null;
	}
	// Steam search results don't include release dates
	return null;
};

const getRating = (game: IGDBSearch | SteamSearch): number | null => {
	if (isIGDBGame(game)) {
		// IGDB ratings: prioritize total_rating > aggregated_rating > rating
		const rating = game.total_rating ?? game.aggregated_rating ?? game.rating;
		return rating ? Math.round(rating) : null;
	}

	if (isSteamGame(game)) {
		// Steam metascore is a string that needs parsing
		if (game.metascore) {
			const parsed = Number.parseFloat(game.metascore);
			return Number.isNaN(parsed) ? null : Math.round(parsed);
		}
	}

	return null;
};

const getGenres = (game: IGDBSearch | SteamSearch): string | null => {
	if (isIGDBGame(game)) {
		if (!game.genres || game.genres.length === 0) {
			return null;
		}
		return game.genres.map((genre) => genre.name).join(", ");
	}

	// Steam search results don't include genres
	return null;
};

// Format rating with appropriate scale indication
const formatRating = (
	rating: number,
	game: IGDBSearch | SteamSearch,
): string => {
	if (isSteamGame(game)) {
		// Metascore is out of 100
		return `${rating}/100`;
	}
	// IGDB ratings are out of 100
	return `${rating}/100`;
};

export const SelectableGameCard = ({
	game,
	isSelected,
	setSelectedGame,
}: SelectGameCardProps) => {
	const imageUrl = getImageUrl(game);
	const releaseDate = getReleaseDate(game);
	const rating = getRating(game);
	const genres = getGenres(game);

	return (
		<Card
			onClick={() => setSelectedGame(game.id)}
			className={cn("cursor-pointer transition-all hover:border-primary/50", {
				"border-2 border-primary": isSelected,
			})}
		>
			<CardContent className="p-4">
				<div className="flex items-start gap-4">
					{/* Game Image */}
					<div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-800">
						{imageUrl ? (
							<Image
								src={imageUrl}
								alt={game.name}
								fill
								className="object-cover"
								sizes="80px"
								loading="lazy"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center">
								<ImageOff className="h-8 w-8 text-gray-600" />
							</div>
						)}
					</div>

					{/* Game Info */}
					<div className="flex min-w-0 flex-1 items-start justify-between gap-4">
						<div className="min-w-0 flex-1 space-y-2">
							{/* Title */}
							<div className="flex items-start gap-2">
								<Gamepad2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
								<h3 className="font-semibold text-lg text-white leading-tight">
									{game.name}
								</h3>
							</div>

							{/* Metadata */}
							<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-400 text-sm">
								{releaseDate && (
									<div className="flex items-center gap-1">
										<Calendar className="h-3 w-3 flex-shrink-0" />
										<span>{releaseDate}</span>
									</div>
								)}
								{genres && (
									<div className="flex min-w-0 items-center gap-1">
										<Tag className="h-3 w-3 flex-shrink-0" />
										<span className="truncate">{genres}</span>
									</div>
								)}
							</div>

							{/* Rating */}
							{rating !== null && (
								<div className="flex items-center gap-1">
									<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
									<span className="rounded-full bg-green-500/20 px-2 py-0.5 font-medium text-green-400 text-xs">
										{formatRating(rating, game)}
									</span>
								</div>
							)}
						</div>

						{/* Selection indicator */}
						{isSelected && (
							<div className="flex-shrink-0">
								<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
									<Check className="h-4 w-4 text-white" />
								</div>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
