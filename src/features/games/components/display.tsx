"use client";

import type { PaginationOptions } from "@/@types";
import { api } from "@/trpc/react";
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
  const { data: games } = api.game.getAll.useQuery();

  return (
    <div className="flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h3 className="font-semibold text-xl tracking-tighter sm:text-2xl">
          Games
        </h3>
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
      <div className="flex-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {!!(games && games?.length > 0)
            ? games
                .filter(
                  (game) =>
                    selectedConferences.length === 0 ||
                    (game.conferenceId &&
                      selectedConferences.includes(game.conferenceId))
                )
                .map((game) => <GameCard key={game.id} {...game} />)
            : "No games found."}
        </div>
      </div>

      {/* Pagination Section */}
      {/* <div className="flex justify-end py-4"> */}
      {/* <Pagination totalResults={total} current={page} pageSize={20} /> */}
      {/* </div> */}
    </div>
  );
};

export default GamesDisplay;
