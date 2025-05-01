import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import ConferenceCard from "./cards/conference";

const ConferencesDisplay = async () => {
	const data = await api.conference.getAll({
		withStreams: true,
	});

	return (
		<div className="flex h-full flex-col items-center gap-2">
			{/* <div className="flex w-full justify-end">
        <ConferenceToggle open={open} setOpen={setOpen} />
      </div> */}
			<Card
				className={cn(
					"pointer-events-auto h-full w-full transform-gpu transition-all duration-300 ease-in-out",
					{
						// "translate-y-0 scale-100 opacity-100 shadow-lg": open,
						// "-translate-y-[58px] pointer-events-none translate-x-9 scale-90 opacity-0 shadow-none":
						// !open,
					},
				)}
			>
				<CardHeader className="flex items-center justify-center">
					<CardTitle>Conferences</CardTitle>
				</CardHeader>
				<div className="flex flex-col gap-3 px-4 pb-6">
					{data?.length > 0
						? data?.map((conference) => (
								<ConferenceCard key={conference.id} {...conference} />
							))
						: "No conferences found."}
				</div>
			</Card>
		</div>
	);
};

export default ConferencesDisplay;
