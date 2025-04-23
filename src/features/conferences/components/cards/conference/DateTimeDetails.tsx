"use client";

import type { conferences } from "@/server/db/schema";
import { format } from "date-fns";
import type { InferSelectModel } from "drizzle-orm";
import { CalendarIcon } from "lucide-react";

interface CardHeaderProps extends InferSelectModel<typeof conferences> {}

const DateTimeDetails = ({ startTime, endTime }: CardHeaderProps) => {
	const formattedDate = startTime ? format(startTime, "PPP") : "Unknown";
	const formattedStartTime = startTime ? format(startTime, "p") : "Unknown";
	const formattedEndTime = endTime ? format(endTime, "p") : "Unknown";

	return (
		<div className="flex items-center gap-2">
			<CalendarIcon className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />
			<div>
				<span className="font-medium text-muted-foreground text-xs md:text-sm">
					{formattedDate}
				</span>{" "}
				<span className="text-muted-foreground text-xs md:text-sm">
					| {formattedStartTime} - {formattedEndTime}
					<span className="ml-1 text-muted-foreground text-xs">estimate</span>
				</span>
			</div>
		</div>
	);
};

export default DateTimeDetails;
