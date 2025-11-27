"use client";

import type { InferSelectModel } from "drizzle-orm";
import { PlayCircle } from "lucide-react";
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
	priority?: boolean;
}

export default function GameCard({
	features,
	conference,
	media,
	releaseDate,
	title,
	priority = false,
}: GameCardProps) {
	const selectedMedia = media?.[0] ?? null;

	const initialSrc = useMemo(() => {
		if (!selectedMedia) return "/icon.png";
		if (selectedMedia.type === MediaType.Image) return selectedMedia.link;

		return getImageFromURL(selectedMedia.link) ?? "/icon.png";
	}, [selectedMedia]);

	const [imageSrc, setImageSrc] = useState(initialSrc);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setImageSrc(initialSrc);
		setIsLoading(true);
	}, [initialSrc]);

	const trailerLink = useMemo(
		() => media.find((m) => m.type === MediaType.Video)?.link,
		[media],
	);

	const hasTrailer = !!trailerLink;

	const handleImageError = () => {
		setImageSrc("/icon.png");
		setIsLoading(false);
	};

	const handleImageLoad = () => {
		setIsLoading(false);
	};

	const CardWrapper = hasTrailer ? "a" : "div";
	const wrapperProps = hasTrailer
		? {
				href: trailerLink,
				target: "_blank",
				rel: "noopener noreferrer",
				"aria-label": `Watch trailer for ${title ?? "Untitled Game"}`,
				className:
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl",
			}
		: {};

	return (
		<Card
			className={cn(
				"group relative w-full max-w-full overflow-hidden rounded-xl bg-card shadow-sm transition-all duration-300",
				hasTrailer
					? "hover:-translate-y-1 cursor-pointer hover:shadow-primary/5 hover:shadow-xl"
					: "cursor-default",
			)}
			aria-label={`Game card for ${title ?? "Untitled Game"}`}
		>
			<CardWrapper {...wrapperProps}>
				<CardContent className="relative p-0">
					{/* Features Badge - Top Right */}
					{features && features.length > 0 && (
						<div className="absolute top-3 right-3 z-20">
							<Badge
								variant="secondary"
								className="max-w-[calc(100%-1.5rem)] truncate bg-background/90 capitalize shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:bg-background"
							>
								{combineFeatures(features)}
							</Badge>
						</div>
					)}

					{/* Trailer Indicator - Top Left */}
					{hasTrailer && (
						<div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-primary/90 px-2.5 py-1 font-medium text-primary-foreground text-xs shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:bg-primary">
							<PlayCircle className="h-3.5 w-3.5" />
							<span>Watch Trailer</span>
						</div>
					)}

					{/* Image Container */}
					<div className="relative aspect-video overflow-hidden bg-muted">
						{isLoading && (
							<div className="absolute inset-0 z-10 flex items-center justify-center bg-muted">
								<div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
							</div>
						)}
						<Image
							src={imageSrc}
							alt={title || "Game"}
							fill
							priority={priority}
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							onError={handleImageError}
							onLoad={handleImageLoad}
							className={cn(
								"object-cover transition-all duration-500",
								hasTrailer &&
									"group-hover:scale-105 group-hover:brightness-110",
								imageSrc === "/icon.png" && "object-contain p-8",
							)}
						/>
						{/* Gradient Overlay on Hover */}
						{hasTrailer && (
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
						)}
					</div>

					{/* Footer with Improved Layout */}
					<CardFooter className="flex flex-col gap-3 p-4">
						{/* Top Row: Conference & Release Date */}
						<div className="flex w-full items-center justify-between gap-2">
							<Badge
								variant="outline"
								className="max-w-[60%] truncate text-xs"
								title={conference?.name ?? "Upcoming"}
							>
								{conference?.name ?? "Upcoming"}
							</Badge>

							{releaseDate && (
								<CardDescription
									className="text-muted-foreground text-xs"
									title={releaseDate.toString()}
								>
									{getFormattedDate(releaseDate)}
								</CardDescription>
							)}
						</div>

						{/* Title - More Prominent */}
						<CardTitle
							className={cn(
								"line-clamp-2 font-bold text-base leading-tight transition-colors duration-300",
								hasTrailer && "group-hover:text-primary",
							)}
							title={title ?? "Untitled"}
						>
							{title ?? "Untitled"}
						</CardTitle>

						{/* No Trailer Message */}
						{!hasTrailer && (
							<p className="text-muted-foreground/60 text-xs italic">
								Trailer coming soon
							</p>
						)}
					</CardFooter>
				</CardContent>
			</CardWrapper>
		</Card>
	);
}
