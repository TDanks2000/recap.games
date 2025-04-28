"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { cn, getImageFromURL } from "@/lib/utils";
import type { InferSelectModel } from "drizzle-orm";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { MediaType } from "@/@types";
import type { conferences, games, media } from "@/server/db/schema";

interface GameCardProps extends InferSelectModel<typeof games> {
  conference: InferSelectModel<typeof conferences> | null;
  media: Array<InferSelectModel<typeof media>>;
}

export default function GameCard({
  features,
  conference,
  media,
  releaseDate,
  title,
}: GameCardProps) {
  const selectedMedia = useMemo(() => media?.[0] ?? null, [media]);

  const [src, setSrc] = useState<string>(() => {
    if (!selectedMedia) return "/icon.png";
    if (selectedMedia.type === MediaType.Image) return selectedMedia.link;
    return getImageFromURL(selectedMedia.link) ?? "/icon.png";
  });

  useEffect(() => {
    if (!selectedMedia) {
      setSrc("/icon.png");
    } else if (selectedMedia.type === MediaType.Image) {
      setSrc(selectedMedia.link);
    } else {
      setSrc(getImageFromURL(selectedMedia.link) ?? "/icon.png");
    }
  }, [selectedMedia]);

  const trailerLink = useMemo(
    () => media.find((m) => m.type === MediaType.Video)?.link,
    [media]
  );

  return (
    <Card
      className={cn(
        "group w-full max-w-full cursor-pointer overflow-hidden rounded-xl bg-card/50 pt-0 shadow-sm transition-all duration-300 hover:bg-card hover:shadow-lg sm:max-w-[280px] sm:flex-1 md:max-w-[300px]",
        { "pointer-events-none": !trailerLink }
      )}
    >
      <a href={trailerLink ?? "#"} target="_blank" rel="noopener noreferrer">
        <CardContent className="relative p-0">
          {features?.length > 0 && (
            <div className="absolute top-2 right-2 z-10">
              <Badge
                variant="secondary"
                className="max-w-full truncate bg-black/50 capitalize backdrop-blur-sm transition-colors group-hover:bg-black/70"
              >
                {features[0]}
              </Badge>
            </div>
          )}

          <div className="relative overflow-hidden">
            <Image
              src={src}
              alt={title || "Game"}
              width={300}
              height={160}
              onError={() => setSrc("/icon.png")}
              className={cn(
                "aspect-video w-full transform object-cover transition-transform duration-500 group-hover:scale-110",
                { "object-contain": src === "/icon.png" }
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <CardFooter className="flex flex-col items-start gap-1.5 p-4">
            <Badge
              variant="secondary"
              className="max-w-full truncate bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            >
              {conference?.name ?? "Upcoming"}
            </Badge>
            <CardTitle className="line-clamp-2 font-semibold text-sm leading-tight tracking-tight transition-colors group-hover:text-primary sm:text-base">
              {title ?? "Untitled"}
            </CardTitle>
            <CardDescription className="truncate text-muted-foreground/80 text-xs transition-colors group-hover:text-muted-foreground sm:text-sm">
              {releaseDate?.toString()}
            </CardDescription>
          </CardFooter>
        </CardContent>
      </a>
    </Card>
  );
}
