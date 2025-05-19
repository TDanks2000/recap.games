import type { InferSelectModel } from "drizzle-orm";
import { ExternalLinkIcon } from "lucide-react";
import type { conferences, games, streams } from "@/server/db/schema";
import CardHeader from "./CardHeader";
import DateTimeDetails from "./DateTimeDetails";

interface ConferenceCardProps extends InferSelectModel<typeof conferences> {
	games?: Array<InferSelectModel<typeof games>> | null;
	streams?: Array<InferSelectModel<typeof streams>> | null;
}

const ConferenceCard = (conference: ConferenceCardProps) => {
	const stream = conference?.streams?.[0];

	return (
		<a
			href={stream?.link}
			className="group hover:-translate-y-1 relative flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
			target="_blank"
			rel="noreferrer"
			aria-label={`View ${conference.name} conference stream`}
		>
			<CardHeader {...conference} />
			<DateTimeDetails {...conference} />

			{stream?.link && (
				<div className="mt-2 flex items-center gap-2 text-accent-foreground text-xs transition-colors duration-200 group-focus-within:underline group-hover:underline">
					<ExternalLinkIcon className="size-3" aria-hidden="true" />
					<span>Watch stream</span>
				</div>
			)}
		</a>
	);
};

export default ConferenceCard;
