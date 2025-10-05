import { ExternalLink, VideoOff } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { getYouTubeEmbedUrl } from "@/lib/link-helper";

type TrailerDialogProps = {
	url: string | undefined;
	title: string;
	description?: string;
};

export const TrailerDialog = ({
	children,
	url,
	title,
	description,
}: PropsWithChildren<TrailerDialogProps>) => {
	const embed = getYouTubeEmbedUrl(url);

	return (
		<Dialog>
			<DialogTrigger className="cursor-pointer">{children}</DialogTrigger>

			<DialogContent className="max-h-[100svh] min-w-[65svw] overflow-hidden">
				<DialogHeader className="flex-shrink-0">
					<DialogTitle className="line-clamp-2">{title}</DialogTitle>
					{!!description?.length && (
						<DialogDescription className="truncate">
							{description}
						</DialogDescription>
					)}
				</DialogHeader>

				<div className="flex size-full flex-1 items-center justify-center">
					{embed?.length ? (
						<div className="flex size-full w-full items-center justify-center">
							<AspectRatio
								ratio={16 / 9}
								className={"overflow-hidden rounded-md"}
							>
								<iframe
									src={embed}
									title={title}
									loading="lazy"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									width="100%"
									height="100%"
									className="block h-full w-full"
									style={{ border: 0 }}
								/>
							</AspectRatio>
						</div>
					) : (
						<div className="flex h-full w-full items-center justify-center p-2">
							<Alert className="w-full max-w-lg">
								<VideoOff />
								<AlertTitle>No trailer available</AlertTitle>
								<AlertDescription>
									No video was found for this title.
								</AlertDescription>
							</Alert>
						</div>
					)}
				</div>

				<DialogFooter className="flex-shrink-0">
					{url ? (
						<Button asChild>
							<a href={url} target="_blank" rel="noopener noreferrer">
								<ExternalLink />
								Open External
							</a>
						</Button>
					) : (
						<Button disabled>
							<ExternalLink />
							Open External
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
