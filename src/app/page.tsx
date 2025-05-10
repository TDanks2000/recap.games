import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
					<Suspense
						fallback={
							<div className="flex size-full flex-col gap-6">
								{/* Header Skeleton */}
								<div className="flex flex-col items-start justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
									<div className="flex items-center gap-2">
										<Skeleton className="h-6 w-6 rounded-full" />
										<Skeleton className="h-8 w-24" />
									</div>
									<Skeleton className="h-10 w-40" />
								</div>

								{/* Games Grid Skeleton */}
								<div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
									{Array(6)
										.fill(0)
										.map((_, i) => (
											<Skeleton
												// biome-ignore lint/suspicious/noArrayIndexKey: this is fine for skeletons
												key={i}
												className="aspect-[3/4] w-full rounded-xl"
											/>
										))}
								</div>
							</div>
						}
					>
						<GamesDisplay searchParams={params} />
					</Suspense>
				</div>

				{/* Conferences Display Section with sticky only on larger screens */}
				<div className="top-5 right-0 order-1 overflow-hidden transition-all sm:sticky sm:order-2 sm:h-[calc(100vh-50px)] sm:w-[450px]">
					<Suspense
						fallback={
							<div className="flex h-full flex-col items-center gap-2">
								<Skeleton className="h-full w-full rounded-xl p-6">
									<div className="flex flex-col items-center">
										<Skeleton className="mb-4 h-8 w-32" />
										<div className="flex w-full flex-col gap-3">
											{Array(3)
												.fill(0)
												.map((_, i) => (
													<Skeleton
														// biome-ignore lint/suspicious/noArrayIndexKey: this is fine for skeletons
														key={i}
														className="h-16 w-full rounded-lg"
													/>
												))}
										</div>
									</div>
								</Skeleton>
							</div>
						}
					>
						<ConferencesDisplay />
					</Suspense>
				</div>
			</main>
		</HydrateClient>
	);
}
