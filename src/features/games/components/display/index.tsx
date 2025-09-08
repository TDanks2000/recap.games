import { Gamepad2 } from "lucide-react";
import { Suspense } from "react";
import type { HomeSearchParams } from "@/@types";
import { ConferenceFilterSkeleton } from "@/components/skeletons/conference-filter-skeleton";
import { GamesGridSkeleton } from "@/components/skeletons/GamesGridSkeleton";
import { GamesSortSkeleton } from "@/components/skeletons/games-sort-skeleton";
import ConferenceFilterClient from "../ConferenceFilterClient";
import GamesSortClient from "../GamesSortClient";
import { GamesList } from "./GamesList";

type GamesDisplayProps = {
	searchParams: HomeSearchParams;
};

export default function GamesDisplay({ searchParams }: GamesDisplayProps) {
	const suspenseKey = JSON.stringify(searchParams);

	return (
		<div className="flex w-full flex-col gap-6">
			<div className="flex w-full flex-col items-start justify-between gap-4 pb-4 sm:flex-row sm:items-center">
				<div className="flex items-center gap-2">
					<Gamepad2 className="h-6 w-6 text-primary" />
					<h3 className="font-semibold text-xl tracking-tight sm:text-2xl">
						Games
					</h3>
				</div>
				<div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
					<Suspense fallback={<GamesSortSkeleton />}>
						<GamesSortClient directionOnLeft />
					</Suspense>
					<Suspense fallback={<ConferenceFilterSkeleton />}>
						<ConferenceFilterClient />
					</Suspense>
				</div>
			</div>

			<Suspense key={suspenseKey} fallback={<GamesGridSkeleton />}>
				<GamesList searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
