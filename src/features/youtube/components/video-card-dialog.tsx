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
import { VideoCardMultiDialog } from "./video-card-multi-dialog"; // <-- added

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

				// Responsive container:
				// - small screens: stacked (column) with full-width primary button
				// - md+: inline row with auto-width buttons
				return (
					<div className="flex gap-2">
						{/* Primary "Add this video" dialog (fills width on small screens) */}
						<Dialog>
							<DialogTrigger asChild>
								<Button className="w-full md:w-auto">Add this video</Button>
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

						{/* Secondary "Data Map" action - keeps its own sizing and follows the responsive layout */}
						<div className="flex-shrink-0">
							<VideoCardMultiDialog
								video={currentVideo}
								conference={conference}
							/>
						</div>
					</div>
				);
			}}
		/>
	);
};
