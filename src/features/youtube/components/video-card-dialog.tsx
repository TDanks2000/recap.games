"use client";

import { MediaType } from "@/@types";
import type { YouTubeVideo } from "@/@types/youtube";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import GameForm from "@/features/admin/components/GameForm";
import { getPrimaryYouTubeTitleSegment } from "@/lib/title";
import type { RouterOutputs } from "@/trpc/react";
import { YoutubeVideoCard } from "./video-card";

type Conference = RouterOutputs["conference"]["getAll"][number];

interface Props {
	video: YouTubeVideo;
	conference?: Conference;
}

export const VideoCardDialog = ({ video, conference }: Props) => {
	return (
		<YoutubeVideoCard
			key={video.id}
			video={video}
			renderActionButton={(currentVideo) => {
				const currentTitle = getPrimaryYouTubeTitleSegment(currentVideo.title);

				return (
					<Dialog>
						<DialogTrigger asChild>
							<Button>Add this video</Button>
						</DialogTrigger>
						<DialogContent className="flex h-[90svh] min-h-[90svh] w-[90svw] min-w-[90svw] flex-col">
							<DialogHeader className="flex-shrink-0">
								<DialogTitle>Add Video: {currentTitle}</DialogTitle>
							</DialogHeader>

							<div className="flex-grow overflow-y-auto p-1">
								<GameForm
									formIndex={0}
									initialData={{
										title: currentTitle ?? currentVideo.title ?? "",
										conference: conference,
										media: [
											{
												link: currentVideo.videoUrl,
												type: MediaType.Video,
											},
										],
									}}
								/>
							</div>
						</DialogContent>
					</Dialog>
				);
			}}
		/>
	);
};
