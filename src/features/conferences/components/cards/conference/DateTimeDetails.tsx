"use client";

import { format } from "date-fns";
import type { InferSelectModel } from "drizzle-orm";
import { Calendar, Clock } from "lucide-react";
import type { conferences } from "@/server/db/schema";

interface DateTimeDetailsProps extends InferSelectModel<typeof conferences> {}

const DateTimeDetails = ({ startTime, endTime }: DateTimeDetailsProps) => {
	if (!startTime) {
		return (
			<div className="rounded-lg bg-muted/40 px-3 py-2.5">
				<p className="text-muted-foreground text-xs">Date & time TBA</p>
			</div>
		);
	}

	const formattedDate = format(startTime, "PPP");
	const formattedStartTime = format(startTime, "p");
	const formattedEndTime = endTime ? format(endTime, "p") : "TBA";

	return (
		<div className="flex flex-col gap-2 rounded-lg bg-muted/40 px-3 py-2.5">
			{/* Date */}
			<div className="flex items-center gap-2">
				<Calendar className="h-4 w-4 flex-shrink-0 text-primary/70" />
				<span className="font-medium text-foreground text-sm">
					{formattedDate}
				</span>
			</div>

			{/* Time Range */}
			<div className="flex items-center gap-2">
				<Clock className="h-4 w-4 flex-shrink-0 text-primary/70" />
				<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
					<span className="font-medium">{formattedStartTime}</span>
					<span>→</span>
					<span className="font-medium">{formattedEndTime}</span>
					<span className="text-[10px] text-muted-foreground/60">(approx)</span>
				</div>
			</div>
		</div>
	);
};

export default DateTimeDetails;
