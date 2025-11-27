import type { InferSelectModel } from "drizzle-orm";
import { ArrowRight, ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { conferences, games, streams } from "@/server/db/schema";
import CardHeader from "./CardHeader";
import DateTimeDetails from "./DateTimeDetails";

interface ConferenceCardProps extends InferSelectModel<typeof conferences> {
	games?: Array<InferSelectModel<typeof games>> | null;
	streams?: Array<InferSelectModel<typeof streams>> | null;
}

const ConferenceCard = (conference: ConferenceCardProps) => {
	const stream = conference?.streams?.[0];
	const now = new Date();
	const isLive =
		!!conference.startTime &&
		conference.startTime <= now &&
		(!conference.endTime || conference.endTime > now);

	const hasStream = !!stream?.link;

	const CardWrapper = hasStream ? "a" : "div";
	const wrapperProps = hasStream
		? {
				href: stream.link,
				target: "_blank",
				rel: "noopener noreferrer",
				"aria-label": `View ${conference.name} conference stream`,
			}
		: {};

	return (
		<CardWrapper
			{...wrapperProps}
			className={cn(
				"group relative flex h-full w-full flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all duration-300",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
				hasStream && "hover:-translate-y-0.5 cursor-pointer hover:shadow-lg",
				isLive
					? "border-red-500/30 shadow-red-500/10 hover:border-red-500/50 hover:shadow-red-500/20"
					: hasStream && "hover:border-primary/40",
			)}
		>
			{/* Top accent line */}
			{hasStream && (
				<div
					className={cn(
						"absolute top-0 right-0 left-0 h-1 rounded-t-xl transition-opacity duration-300",
						isLive
							? "bg-gradient-to-r from-red-500 via-red-400 to-red-500 opacity-100"
							: "bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100",
					)}
				/>
			)}

			{/* Live Indicator - Animated */}
			{isLive && (
				<div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-red-500 px-3 py-1.5 shadow-lg">
					<div className="relative flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
					</div>
					<span className="font-bold text-white text-xs uppercase tracking-wide">
						Live
					</span>
				</div>
			)}

			<div className="relative z-10 flex flex-col gap-4">
				<CardHeader {...conference} isLive={isLive} />
				<DateTimeDetails {...conference} />

				{/* Game Count Badge */}
				{conference.games && conference.games.length > 0 && (
					<div className="flex items-center gap-2 text-muted-foreground text-xs">
						<span className="rounded-md bg-muted px-2 py-1">
							{conference.games.length}{" "}
							{conference.games.length === 1 ? "game" : "games"}
						</span>
					</div>
				)}

				{/* CTA Footer */}
				{hasStream ? (
					<div className="mt-auto flex items-center justify-between border-border/30 border-t pt-4">
						<div className="flex items-center gap-2 text-muted-foreground/70 text-xs transition-colors group-hover:text-primary">
							<ExternalLinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
							<span className="font-medium uppercase tracking-wider">
								Watch Stream
							</span>
						</div>
						<ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
					</div>
				) : (
					<div className="mt-auto border-border/30 border-t pt-4">
						<p className="text-muted-foreground/60 text-xs italic">
							Stream link coming soon
						</p>
					</div>
				)}
			</div>
		</CardWrapper>
	);
};

export default ConferenceCard;
