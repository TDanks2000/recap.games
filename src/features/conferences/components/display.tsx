import type { HomeSearchParams } from "@/@types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getYearFromSearchParams } from "@/lib/utils";
import { api } from "@/trpc/server";
import { filterAndSortConferences } from "../utils/filterAndSortConferences";
import ConferenceCard from "./cards/conference";

interface Props {
	searchParams: HomeSearchParams;
}

const ConferencesDisplay = async ({ searchParams }: Props) => {
	const year = getYearFromSearchParams(searchParams);
	const data = (await api.conference.getAll({ withStreams: true, year })) ?? [];
	const sorted = filterAndSortConferences(data, searchParams);

	return (
		<div className="flex w-full flex-col items-center gap-2">
			<Card
				className={cn(
					"pointer-events-auto w-full transform-gpu overflow-hidden transition-all duration-300 ease-in-out",
					"sm:h-full",
				)}
			>
				<CardHeader className="flex items-center justify-center">
					<CardTitle>Conferences {year ? `· ${year}` : null}</CardTitle>
				</CardHeader>
				<div className="scrollbar-hide flex max-h-[calc(100svh-180px)] flex-col gap-3 overflow-y-scroll px-4 pt-1 pb-6">
					{sorted.length > 0 ? (
						sorted.map((conference) => (
							<ConferenceCard key={conference.id} {...conference} />
						))
					) : (
						<div className="text-center text-muted-foreground text-sm">
							<p>No conferences found for {year}.</p>
							{searchParams.search && (
								<p className="mt-2">Try adjusting your search terms.</p>
							)}
						</div>
					)}
				</div>
			</Card>
		</div>
	);
};

export default ConferencesDisplay;
