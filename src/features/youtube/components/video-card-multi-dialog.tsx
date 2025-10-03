"use client";

import { Map as MapIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { MediaType } from "@/@types";
import type { YouTubeVideo } from "@/@types/youtube";
import { Button } from "@/components/ui/button";
import { GameImportDialog } from "@/features/data-mapping/components/GameImportDialog";
import { getPrimaryYouTubeTitleSegment } from "@/lib/title";
import type { RouterOutputs } from "@/trpc/react";

type Conference = RouterOutputs["conference"]["getAll"][number];

interface Props {
	video: YouTubeVideo;
	conference?: Conference;
}

export const VideoCardMultiDialog = ({ video, conference }: Props) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const currentTitle = useMemo(
		() => getPrimaryYouTubeTitleSegment(video.title),
		[video.title],
	);

	const title = useMemo(
		() => currentTitle ?? video.title ?? "",
		[video.title, currentTitle],
	);

	return (
		<>
			<Button
				size="icon"
				onClick={() => setIsDialogOpen(true)}
				aria-label="Open data map"
				title="Data map"
			>
				<MapIcon className="h-4 w-4" />
			</Button>

			<GameImportDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				preData={{
					title,
					conference: conference,
					media: [
						{
							link: video.videoUrl,
							type: MediaType.Video,
						},
					],
				}}
				initalQuery={title}
			/>
		</>
	);
};
