"use client";

import type { InferSelectModel } from "drizzle-orm";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import createCountdownHook, { type TimeLeft } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";
import type { conferences } from "@/server/db/schema";

interface CardHeaderProps extends InferSelectModel<typeof conferences> {
	isLive?: boolean;
}

const CardHeader = (conference: CardHeaderProps) => {
	const status =
		conference.startTime && conference.endTime
			? conference.startTime > new Date()
				? "UPCOMING"
				: conference.endTime > new Date()
					? "ONGOING"
					: "ENDED"
			: "UPCOMING";

	const badgeVariant: ComponentProps<typeof Badge>["variant"] =
		status === "ONGOING"
			? "default"
			: status === "UPCOMING"
				? "secondary"
				: "outline";

	// State for countdown timer
	const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

	// Setup countdown timer for upcoming conferences
	useEffect(() => {
		if (status === "UPCOMING" && conference.startTime) {
			const stopCountdown = createCountdownHook(
				conference.startTime,
				(newTimeLeft) => setTimeLeft(newTimeLeft),
			);
			return stopCountdown;
		}
	}, [status, conference.startTime]);

	return (
		<div className="flex flex-col gap-3">
			{/* Title */}
			<h2
				className={cn(
					"line-clamp-2 font-bold text-base leading-tight transition-colors duration-300 sm:text-lg",
					conference.isLive
						? "text-red-500 group-hover:text-red-400"
						: "text-foreground group-hover:text-primary",
				)}
				title={conference.name}
			>
				{conference.name}
			</h2>

			{/* Status Badge or Countdown */}
			<div className="flex items-center gap-2">
				{status === "UPCOMING" && timeLeft ? (
					<div className="flex items-center gap-2">
						<Badge
							variant="secondary"
							className="bg-primary/10 font-semibold text-primary text-xs shadow-sm"
						>
							Starts in
						</Badge>
						<div className="flex items-center gap-1 font-mono text-muted-foreground text-xs">
							<span className="rounded bg-muted px-1.5 py-0.5 font-semibold tabular-nums">
								{timeLeft.days}d
							</span>
							<span className="rounded bg-muted px-1.5 py-0.5 font-semibold tabular-nums">
								{timeLeft.hours}h
							</span>
							<span className="rounded bg-muted px-1.5 py-0.5 font-semibold tabular-nums">
								{timeLeft.minutes}m
							</span>
						</div>
					</div>
				) : (
					<Badge
						variant={badgeVariant}
						className={cn(
							"font-semibold text-xs shadow-sm",
							status === "ENDED" && "bg-muted text-muted-foreground",
						)}
					>
						{status}
					</Badge>
				)}
			</div>
		</div>
	);
};

export default CardHeader;
