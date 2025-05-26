"use client";

import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import type { YouTubeChannel } from "@/@types/youtube";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface Props {
	channel: YouTubeChannel;
	/**
	 * Optional custom action button renderer.
	 * Receives the channel object.
	 */
	renderActionButton?: (channel: YouTubeChannel) => React.ReactNode;
}

export const YoutubeChannelCard = ({ channel, renderActionButton }: Props) => {
	const fallbackText = channel.title.charAt(0).toUpperCase();

	return (
		<Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/20">
			<CardHeader className="pb-2">
				<div className="flex items-center gap-4">
					<Avatar className="size-12 border shadow-sm">
						<AvatarImage
							src={channel.thumbnailUrl}
							alt={`${channel.title} channel thumbnail`}
						/>
						<AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
							{fallbackText}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 overflow-hidden">
						<CardTitle className="truncate text-base">
							{channel.title}
						</CardTitle>
						<CardDescription className="truncate text-xs">
							YouTube Channel
						</CardDescription>
					</div>
					<Badge variant="secondary" className="shrink-0 px-2 py-0.5 text-xs">
						Channel
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground text-sm line-clamp-2 mb-4">
					{channel.description || "No description available"}
				</p>
				<div className="flex items-center justify-between">
					<Link
						href={`https://youtube.com/channel/${channel.id}`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1 text-xs text-accent-foreground transition-colors duration-200 group-hover:text-primary group-hover:underline"
					>
						<ExternalLinkIcon className="size-3" />
						<span>Visit Channel</span>
					</Link>
					{renderActionButton ? (
						renderActionButton(channel)
					) : (
						<Button variant="outline" size="sm" className="text-xs h-7 px-2">
							View Details
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
