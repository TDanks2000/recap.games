import type { PaginationOptions } from "@/@types";
import { api } from "@/trpc/server";
import { Gamepad2 } from "lucide-react";
import GameCard from "./cards/game";
import ConferenceFilterClient from "./ConferenceFilterClient";

type GamesDisplayProps = PaginationOptions & {
  searchParams: { conferences?: string };
};

export default async function GamesDisplay({
  searchParams,
}: GamesDisplayProps) {
  // fetch games & conferences on the server
  const [games, conferences] = await Promise.all([
    api.game.getAll(),
    api.conference.getAll(),
  ]);

  // parse selected conference IDs from searchParams
  const selectedConferences = (searchParams.conferences ?? "")
    .split(",")
    .map((s) => Number(s))
    .filter((n) => !isNaN(n) && n > 0);

  // filter server-side as well (for SEO’d list)
  const filteredGames = games.filter(
    (g) =>
      selectedConferences.length === 0 ||
      (g.conferenceId && selectedConferences.includes(g.conferenceId))
  );

  return (
    <div className="size-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <h3 className="font-semibold text-xl tracking-tight sm:text-2xl">
            Games
          </h3>
        </div>
        <ConferenceFilterClient />
      </div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center gap-4 rounded-xl bg-muted/50 py-12 text-center">
          <Gamepad2 className="h-12 w-12 text-muted-foreground" />
          <h3 className="font-semibold text-xl">No Games Found</h3>
          <p className="text-sm text-muted-foreground">
            {selectedConferences.length > 0
              ? "Try adjusting your conference filter"
              : "Check back later for new games"}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Are you looking for last year's games?{" "}
            <a
              href="https://old.recap.games/"
              className="text-primary underline"
              target="_blank"
            >
              Visit the old recap website
            </a>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full">
          {filteredGames.map((game) => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      )}
    </div>
  );
}
