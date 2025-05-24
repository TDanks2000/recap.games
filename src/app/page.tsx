import type { HomeSearchParams } from "@/@types";
import ConferencesDisplay from "@/features/conferences/components/display";
import GamesDisplay from "@/features/games/components/display";
import { HydrateClient } from "@/trpc/server";

interface HomeProps {
	searchParams: Promise<HomeSearchParams>;
}

export default async function Home({ searchParams }: HomeProps) {
	const params = await searchParams;

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col gap-10 p-5 px-4 transition-all md:flex-row md:px-10">
				{/* Games Display Section */}
				<div className="order-2 flex flex-1 sm:order-1">
					<GamesDisplay searchParams={params} />
				</div>

				{/* Conferences Display Section with sticky only on larger screens */}
				<div className="order-1 transition-all sm:sticky sm:top-5 sm:right-0 sm:order-2 sm:h-[calc(100vh-50px)] sm:max-h-full sm:w-[450px] sm:overflow-hidden">
					<ConferencesDisplay searchParams={params} />
				</div>
			</main>
		</HydrateClient>
	);
}
