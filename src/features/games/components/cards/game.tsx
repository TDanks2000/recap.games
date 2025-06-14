"use client";

import type { InferSelectModel } from "drizzle-orm";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MediaType } from "@/@types";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from "@/components/ui/card";
import { getFormattedDate } from "@/lib";
import { cn, combineFeatures, getImageFromURL } from "@/lib/utils";
import type { conferences, games, media } from "@/server/db/schema";

interface GameCardProps extends InferSelectModel<typeof games> {
	conference: InferSelectModel<typeof conferences> | null;
	media: Array<InferSelectModel<typeof media>>;
	priority?: boolean; // Add priority prop for critical, above-the-fold images
}

export default function GameCard({
	features,
	conference,
	media,
	releaseDate,
	title,
	priority = false, // Default priority to false
}: GameCardProps) {
	// The first media item is used for the card's primary image.
	const selectedMedia = media?.[0] ?? null;

	// Derive the initial image source directly from props.
	// This avoids unnecessary re-renders compared to calculating it inside an effect.
	const initialSrc = useMemo(() => {
		if (!selectedMedia) return "/icon.png";
		if (selectedMedia.type === MediaType.Image) return selectedMedia.link;
		// Assuming getImageFromURL is a lightweight utility to extract a thumbnail.
		return getImageFromURL(selectedMedia.link) ?? "/icon.png";
	}, [selectedMedia]);

	const [imageSrc, setImageSrc] = useState(initialSrc);
	const [isLoading, setIsLoading] = useState(true);

	// When the initial source changes (e.g., props update),
	// reset the image source and loading state.
	useEffect(() => {
		setImageSrc(initialSrc);
		setIsLoading(true);
	}, [initialSrc]);

	// Memoize the trailer link to prevent recalculation on every render.
	const trailerLink = useMemo(
		() => media.find((m) => m.type === MediaType.Video)?.link,
		[media],
	);

	const handleImageError = () => {
		// Fallback to a default icon if the primary image fails to load.
		setImageSrc("/icon.png");
		setIsLoading(false);
	};

	const handleImageLoad = () => {
		setIsLoading(false);
	};

	return (
		<Card
			className={cn(
				"group hover:-translate-y-1 relative w-full max-w-full cursor-pointer overflow-hidden rounded-xl bg-card/50 pt-0 shadow-sm transition-transform duration-300 hover:bg-card hover:shadow-lg",
				{ "pointer-events-none opacity-60": !trailerLink },
			)}
			aria-label={`Game card for ${title ?? "Untitled Game"}`}
		>
			<a
				href={trailerLink ?? "#"}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`Watch trailer for ${title ?? "Untitled Game"}`}
				className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
			>
				<CardContent className="relative p-0">
					{features?.length > 0 && (
						<div className="absolute top-2 right-2 z-10">
							<Badge
								variant="secondary"
								className="max-w-full truncate capitalize transition-shadow duration-300 group-hover:shadow-lg"
							>
								{combineFeatures(features)}
							</Badge>
						</div>
					)}

					<div className="relative overflow-hidden">
						{isLoading && (
							<div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/10 backdrop-blur-[2px]">
								<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
							</div>
						)}
						<Image
							src={imageSrc}
							alt={title || "Game"}
							width={260}
							height={146}
							priority={priority}
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							onError={handleImageError}
							onLoad={handleImageLoad}
							className={cn(
								"aspect-video w-full transform-gpu object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110",
								{ "object-contain": imageSrc === "/icon.png" },
							)}
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
					</div>

					<CardFooter className="flex flex-col items-start gap-2 p-4">
						<Badge
							variant="secondary"
							className="max-w-full transition-shadow duration-300 hover:shadow-md"
						>
							<span className="block overflow-hidden text-ellipsis whitespace-nowrap">
								{conference?.name ?? "Upcoming"}
							</span>
						</Badge>

						<CardDescription
							className="truncate text-muted-foreground/80 text-xs transition-colors group-hover:text-muted-foreground sm:text-sm"
							title={releaseDate?.toString()}
						>
							{getFormattedDate(releaseDate)}
						</CardDescription>
						<CardTitle
							className="line-clamp-2 font-semibold text-sm leading-tight transition-colors duration-300 group-hover:text-primary sm:text-base"
							title={title ?? "Untitled"}
						>
							{title ?? "Untitled"}
						</CardTitle>
					</CardFooter>
				</CardContent>
			</a>
		</Card>
	);
}
