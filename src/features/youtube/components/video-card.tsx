"use client";

import { CalendarIcon, ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { YouTubeVideo } from "@/@types/youtube";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
	video: YouTubeVideo;
	/**
	 * Optional custom action button renderer.
	 * Receives the video object.
	 */
	renderActionButton?: (video: YouTubeVideo) => React.ReactNode;
}

export const YoutubeVideoCard = ({ video, renderActionButton }: Props) => {
	const [isLoading, setIsLoading] = useState(true);
	const publishedDate = new Date(video.publishedAt);
	const formattedDate = publishedDate.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	});

	return (
		<Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/20 pt-0">
			<div className="relative">
				{/* Thumbnail with loading state */}
				<div className="relative aspect-video w-full overflow-hidden">
					<div
						className={cn(
							"absolute inset-0 z-10 flex items-center justify-center bg-muted/10 backdrop-blur-[2px] transition-opacity duration-300",
							{ "opacity-0": !isLoading },
						)}
					>
						<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					</div>
					<Image
						src={video.thumbnailUrl}
						alt={`${video.title} thumbnail`}
						fill
						className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
						onLoad={() => setIsLoading(false)}
						onError={() => setIsLoading(false)}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				</div>

				{/* Video badge */}
				<div className="absolute top-2 right-2 z-10">
					<Badge variant="secondary" className="px-2 py-0.5 text-xs shadow-md">
						Video
					</Badge>
				</div>
			</div>

			<CardHeader className="pb-2 pt-4">
				<div className="space-y-1">
					<CardDescription className="flex items-center gap-1 text-xs">
						<CalendarIcon className="size-3" />
						<span>{formattedDate}</span>
					</CardDescription>
					<CardTitle className="line-clamp-2 text-base leading-tight">
						{video.title}
					</CardTitle>
				</div>
			</CardHeader>

			<CardContent>
				<p className="text-muted-foreground text-sm line-clamp-5 mb-4">
					{video.description || "No description available"}
				</p>
			</CardContent>

			<CardFooter className="flex items-center justify-between pt-0">
				<Link
					href={`https://youtube.com/watch?v=${video.id}`}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1 text-xs text-accent-foreground transition-colors duration-200 group-hover:text-primary group-hover:underline"
				>
					<ExternalLinkIcon className="size-3" />
					<span>Watch on YouTube</span>
				</Link>
				{renderActionButton ? (
					renderActionButton(video)
				) : (
					<Button variant="outline" size="sm" className="text-xs h-7 px-2">
						View Details
					</Button>
				)}
			</CardFooter>
		</Card>
	);
};
