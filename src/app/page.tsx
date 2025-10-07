import type { HomeSearchParams } from "@/@types";
import { Separator } from "@/components/ui/separator";
import { BlogDisplay } from "@/features/blog/components/display";
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
			<div className="flex flex-col gap-14 p-5 px-4 md:px-10">
				<main className="flex min-h-screen flex-col gap-10 transition-all md:flex-row">
					{/* Games Display Section */}
					<div className="order-2 flex flex-1 sm:order-1">
						<GamesDisplay searchParams={params} />
					</div>

					{/* Conferences Display Section */}
					<div className="order-1 transition-all sm:sticky sm:top-5 sm:right-0 sm:bottom-5 sm:order-2 sm:h-[calc(100%-50px)] sm:max-h-full sm:w-[450px] sm:overflow-hidden">
						<ConferencesDisplay searchParams={params} />
					</div>
				</main>

				<Separator />

				{/* Blog Display Section */}
				<div>
					<BlogDisplay />
				</div>
			</div>
		</HydrateClient>
	);
}
