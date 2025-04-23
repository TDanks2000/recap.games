import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { InferSelectModel } from "drizzle-orm";
import Image from "next/image";

import { MediaType } from "@/@types";
import type { conferences, games, media } from "@/server/db/schema";

interface GameCardProps extends InferSelectModel<typeof games> {
	conference: InferSelectModel<typeof conferences> | null;
	media: Array<InferSelectModel<typeof media>>;
}

const GameCard = ({
	features,
	conference,
	media,
	releaseDate,
	title,
}: GameCardProps) => {
	const image =
		media?.find((media) => media.type === MediaType.Image) ?? media?.[0];

	return (
		<Card className="w-full max-w-full cursor-pointer overflow-hidden rounded-lg pt-0 shadow-md transition-transform hover:scale-105 sm:max-w-[280px] sm:flex-1 md:max-w-[300px]">
			<CardContent className="relative w-full p-0">
				{/* Badge in top-right corner */}
				{!!features?.length && (
					<div className="absolute top-1.5 right-1.5">
						<Badge
							variant="secondary"
							className="max-w-full truncate capitalize"
						>
							{features[0]}
						</Badge>
					</div>
				)}

				{/* Game image */}
				<Image
					src={image?.link ?? "/icon.png"}
					alt={title ?? "Game"}
					width={300}
					height={160}
					className={cn("aspect-video w-full object-cover", {
						"object-contain": !image?.link.length,
					})}
				/>
			</CardContent>

			<CardFooter className="flex flex-col items-start gap-0 p-4">
				{/* Event badge */}
				<div className="mb-1.5 flex flex-wrap gap-1">
					<Badge variant="secondary" className="max-w-full truncate">
						{conference?.name ?? "Upcoming"}
					</Badge>
				</div>
				{/* Game title */}
				<CardTitle className="line-clamp-2 font-semibold text-sm leading-tight sm:text-base">
					{title ?? "??"}
				</CardTitle>
				{/* Release date */}
				<CardDescription className="truncate text-muted-foreground text-xs sm:text-sm">
					{releaseDate ? format(new Date(releaseDate ?? ""), "PPP") : "TBA"}
				</CardDescription>
			</CardFooter>
		</Card>
	);
};

export default GameCard;
