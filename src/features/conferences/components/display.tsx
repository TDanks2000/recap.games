import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import { sortConferences } from "../utils/sortConferences";
import ConferenceCard from "./cards/conference";

const ConferencesDisplay = async () => {
	const data = (await api.conference.getAll({ withStreams: true })) ?? [];
	const sorted = sortConferences(data);

	return (
		<div className="flex w-full flex-col items-center gap-2">
			<Card
				className={cn(
					"pointer-events-auto w-full transform-gpu overflow-hidden transition-all duration-300 ease-in-out",
					"sm:h-full",
				)}
			>
				<CardHeader className="flex items-center justify-center">
					<CardTitle>Conferences</CardTitle>
				</CardHeader>
				<div className="scrollbar-hide flex max-h-[calc(100svh-180px)] flex-col gap-3 overflow-y-scroll px-4 pt-1 pb-6">
					{sorted.length > 0 ? (
						sorted.map((conference) => (
							<ConferenceCard key={conference.id} {...conference} />
						))
					) : (
						<p className="text-center text-muted-foreground text-sm">
							No conferences found.
						</p>
					)}
				</div>
			</Card>
		</div>
	);
};

export default ConferencesDisplay;
