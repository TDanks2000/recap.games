"use client";

import { format } from "date-fns";
import type { InferSelectModel } from "drizzle-orm";
import { CalendarIcon } from "lucide-react";
import type { conferences } from "@/server/db/schema";

interface CardHeaderProps extends InferSelectModel<typeof conferences> {}

const DateTimeDetails = ({ startTime, endTime }: CardHeaderProps) => {
	const formattedDate = startTime ? format(startTime, "PPP") : "Unknown";
	const formattedStartTime = startTime ? format(startTime, "p") : "Unknown";
	const formattedEndTime = endTime ? format(endTime, "p") : "Unknown";

	return (
		<div className="flex items-center gap-2.5 rounded-md bg-muted/40 px-2.5 py-2 transition-colors duration-300">
			<CalendarIcon className="h-4 w-4 text-primary/60 sm:h-5 sm:w-5" />
			<div className="flex flex-col space-y-0.5 sm:flex-row sm:items-center sm:gap-1.5 sm:space-y-0">
				<span className="font-medium text-foreground/80 text-xs sm:text-sm">
					{formattedDate}
				</span>
				<div className="hidden text-muted-foreground/70 sm:block">|</div>
				<span className="text-muted-foreground/90 text-xs sm:text-sm">
					{formattedStartTime} - {formattedEndTime}
					<span className="ml-1.5 text-[10px] text-muted-foreground sm:text-xs">
						estimate
					</span>
				</span>
			</div>
		</div>
	);
};

export default DateTimeDetails;
