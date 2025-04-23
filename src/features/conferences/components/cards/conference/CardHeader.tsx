"use client";

import { Badge } from "@/components/ui/badge";
import type { conferences } from "@/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";

interface CardHeaderProps extends InferSelectModel<typeof conferences> {}

const CardHeader = (conference: CardHeaderProps) => (
	<div className="flex items-center justify-between gap-1">
		<h1 className="truncate font-semibold text-xs md:text-sm">
			{conference.name}
		</h1>
		<Badge
			variant="destructive"
			className="rounded-full px-2 py-0.5 text-[10px] md:text-xs"
		>
			{conference.startTime && conference.endTime
				? conference.startTime > new Date()
					? "UPCOMING"
					: conference.endTime > new Date()
						? "ONGOING"
						: "ENDED"
				: "UPCOMING"}
		</Badge>
	</div>
);

export default CardHeader;
