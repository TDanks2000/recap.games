"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
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

  const trailer = media?.find((media) => media.type === MediaType.Video);

  return (
    <Card className="group w-full max-w-full cursor-pointer overflow-hidden rounded-xl bg-card/50 pt-0 shadow-sm transition-all duration-300 hover:bg-card hover:shadow-lg sm:max-w-[280px] sm:flex-1 md:max-w-[300px]">
      <a href={trailer?.link} target="_blank">
        <CardContent className="relative w-full p-0">
          {/* Badge in top-right corner */}
          {!!features?.length && (
            <div className="absolute top-2 right-2 z-10">
              <Badge
                variant="secondary"
                className="max-w-full truncate capitalize bg-black/50 backdrop-blur-sm transition-colors group-hover:bg-black/70"
              >
                {features[0]}
              </Badge>
            </div>
          )}

          {/* Game image */}
          <div className="relative overflow-hidden">
            <Image
              src={image?.link ?? "/icon.png"}
              alt={title ?? "Game"}
              width={300}
              height={160}
              className={cn(
                "aspect-video w-full transform object-cover transition-transform duration-500 group-hover:scale-110",
                {
                  "object-contain": !image?.link?.length,
                }
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-1.5 p-4">
          {/* Event badge */}
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant="secondary"
              className="max-w-full truncate bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            >
              {conference?.name ?? "Upcoming"}
            </Badge>
          </div>
          {/* Game title */}
          <CardTitle className="line-clamp-2 font-semibold text-sm leading-tight tracking-tight transition-colors group-hover:text-primary sm:text-base">
            {title ?? "??"}
          </CardTitle>
          {/* Release date */}
          <CardDescription className="truncate text-muted-foreground/80 text-xs transition-colors group-hover:text-muted-foreground sm:text-sm">
            {releaseDate?.toString()}
          </CardDescription>
        </CardFooter>
      </a>
    </Card>
  );
};

export default GameCard;
