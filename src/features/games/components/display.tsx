"use client";

import type { PaginationOptions } from "@/@types";
import { api } from "@/trpc/react";
import { Disc3, Gamepad2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import GameCard from "./cards/game";
import ConferenceFilter from "./ConferenceFilter";

type GamesDisplayProps = PaginationOptions;

const GamesDisplay = (options: GamesDisplayProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedConferences =
    searchParams.get("conferences")?.split(",").map(Number).filter(Boolean) ||
    [];
  const { data: games, isLoading } = api.game.getAll.useQuery();

  const filteredGames = games?.filter(
    (game) =>
      selectedConferences.length === 0 ||
      (game.conferenceId && selectedConferences.includes(game.conferenceId))
  );

  return (
    <div className="size-full flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <h3 className="font-semibold text-xl tracking-tight sm:text-2xl">
            Games
          </h3>
        </div>
        <ConferenceFilter
          selectedConferences={selectedConferences}
          onConferenceChange={(conferenceIds) => {
            const params = new URLSearchParams(searchParams);
            if (conferenceIds.length > 0) {
              params.set("conferences", conferenceIds.join(","));
            } else {
              params.delete("conferences");
            }
            router.replace(`${pathname}?${params.toString()}`);
          }}
        />
      </div>

      {/* Games Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center size-full animate-spin">
          <Disc3 className="size-8" />
        </div>
      ) : (
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full">
            {filteredGames?.length ? (
              filteredGames.map((game) => <GameCard key={game.id} {...game} />)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center gap-4 rounded-xl bg-muted/50 py-12 text-center">
                <Gamepad2 className="h-12 w-12 text-muted-foreground" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-xl">No Games Found</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConferences.length > 0
                      ? "Try adjusting your conference filter"
                      : "Check back later for new games"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesDisplay;
