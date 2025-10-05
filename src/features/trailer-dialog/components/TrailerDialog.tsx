import { ExternalLink, VideoOff } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
			<DialogContent className="flex h-[94svh] min-h-[94svh] w-[95svw] min-w-[95svw] flex-col sm:w-[90svw] sm:min-w-[90svw] md:w-[85svw] md:min-w-[85svw] lg:w-[70svw] lg:min-w-[70svw]">
				<DialogHeader className="flex-shrink-0">
					<DialogTitle className="line-clamp-2">{title}</DialogTitle>
					{!!description?.length && (
						<DialogDescription>{description}</DialogDescription>
					)}
				</DialogHeader>

				{/* Show Trailer */}
				<div className="size-full flex-1 flex-grow overflow-hidden p-1">
					{embed?.length ? (
						<div className="aspect-video size-full overflow-hidden rounded-md border-0">
							<iframe
								src={embed ?? undefined}
								title={title}
								loading="lazy"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="size-full object-contain"
							/>
						</div>
					) : (
						<div className="flex size-full flex-1 items-center justify-center p-2">
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
