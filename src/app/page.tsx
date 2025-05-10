import ConferencesDisplay from "@/features/conferences/components/display";
import GamesDisplay from "@/features/games/components/display";
import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

interface HomeProps {
	searchParams: Promise<{ conferences?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
	const session = await auth();
	const params = await searchParams;

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col gap-10 p-5 px-4 transition-all md:flex-row md:px-10">
				{/* Games Display Section */}
				<div className="order-2 flex flex-1 sm:order-1">
					<GamesDisplay searchParams={params} />
				</div>

				{/* Conferences Display Section with sticky only on larger screens */}
				<div className="top-5 right-0 order-1 overflow-hidden transition-all sm:sticky sm:order-2 sm:h-[calc(100vh-50px)] sm:w-[450px]">
					<ConferencesDisplay />
				</div>
			</main>
		</HydrateClient>
	);
}
