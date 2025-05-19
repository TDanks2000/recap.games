"use client";

import type { InferSelectModel } from "drizzle-orm";
import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import type { conferences } from "@/server/db/schema";

interface CardHeaderProps extends InferSelectModel<typeof conferences> {}

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
				: "destructive";

	return (
		<div className="flex items-center justify-between gap-2">
			<h1 className="truncate font-semibold text-foreground/90 text-xs md:text-sm">
				{conference.name}
			</h1>
			<Badge
				variant={badgeVariant}
				className="rounded-full px-2.5 py-0.5 font-medium text-[10px] shadow-sm transition-all duration-300 md:text-xs"
			>
				{status}
			</Badge>
		</div>
	);
};

export default CardHeader;
