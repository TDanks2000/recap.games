import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import { sortConferences } from "../utils/sortConferences";
import ConferenceCard from "./cards/conference";

type Conference = Awaited<
	ReturnType<typeof api.conference.getAll>
> extends (infer U)[]
	? U
	: never;

const ConferencesDisplay = async () => {
	const data = (await api.conference.getAll({ withStreams: true })) ?? [];
	const sorted = sortConferences(data);

	return (
		<div className="flex h-full flex-col items-center gap-2">
			<Card
				className={cn(
					"pointer-events-auto h-full w-full transform-gpu transition-all duration-300 ease-in-out",
				)}
			>
				<CardHeader className="flex items-center justify-center">
					<CardTitle>Conferences</CardTitle>
				</CardHeader>
				<div className="flex flex-col gap-3 px-4 pb-6">
					{sorted.length > 0
						? sorted.map((conference) => (
								<ConferenceCard key={conference.id} {...conference} />
							))
						: "No conferences found."}
				</div>
			</Card>
		</div>
	);
};

export default ConferencesDisplay;
