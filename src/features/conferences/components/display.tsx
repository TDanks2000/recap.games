import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { HomeSearchParams } from "@/@types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { tryCatch } from "@/lib/try-catch";
import { cn, getYearFromSearchParams } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/react";
import { api } from "@/trpc/server";
import { filterAndSortConferences } from "../utils/filterAndSortConferences";
import ConferenceCard from "./cards/conference";

interface Props {
	searchParams: HomeSearchParams;
}

type ConferenceListOutput = RouterOutputs["conference"]["getAll"];
type ConferenceItem = NonNullable<ConferenceListOutput>[number];

const STATUS_FILTERS = [
	{ key: "all", label: "All" },
	{ key: "live", label: "Live" },
	{ key: "upcoming", label: "Upcoming" },
	{ key: "ended", label: "Ended" },
] as const;

const toDate = (val?: unknown | null): Date | undefined => {
	if (!val) return undefined;
	if (val instanceof Date) return val;
	if (typeof val === "string" || typeof val === "number") {
		const d = new Date(val);
		if (!Number.isNaN(d.getTime())) return d;
	}
	return undefined;
};

const getConferenceStatus = (
	conf?: ConferenceItem | null,
	now = new Date(),
) => {
	if (!conf) return "unknown";
	const start = toDate((conf as unknown as { startTime?: unknown })?.startTime);
	const end = toDate((conf as unknown as { endTime?: unknown })?.endTime);

	const isLive = !!start && start <= now && (!end || end > now);
	if (isLive) return "live";
	if (start && start > now) return "upcoming";
	if (end && end <= now) return "ended";
	if (start && start <= now && !end) return "ended";
	return "upcoming";
};

const ConferencesDisplay = async ({ searchParams }: Props) => {
	const year = getYearFromSearchParams(searchParams);
	const res = await tryCatch(
		api.conference.getAll({ withStreams: true, year }) ?? [],
	);

	const data = res.data ?? [];
	const error = res.error;

	if (error) {
		return (
			<div className="col-span-full flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-muted/50 py-12 text-center">
				<AlertTriangle className="h-12 w-12 text-destructive" />
				<h3 className="font-semibold text-destructive text-xl">
					Failed to Load Conferences
				</h3>
				<p className="max-w-md text-muted-foreground text-sm">
					{error.message ??
						"Something went wrong while loading the conferences. Please try again later."}
				</p>
			</div>
		);
	}

	// compute counts safely
	const counts: Record<"all" | "live" | "upcoming" | "ended", number> = {
		all: 0,
		live: 0,
		upcoming: 0,
		ended: 0,
	};
	const now = new Date();

	for (const conf of data ?? []) {
		if (!conf) continue;
		const s = getConferenceStatus(conf, now);
		counts.all += 1;
		if (s === "live") counts.live += 1;
		else if (s === "upcoming") counts.upcoming += 1;
		else if (s === "ended") counts.ended += 1;
		else counts.upcoming += 1;
	}

	const activeStatus =
		typeof searchParams?.status === "string" ? searchParams.status : "all";

	// Build href preserving other params
	const buildHref = (status: string) => {
		const params = new URLSearchParams();

		if (searchParams) {
			Object.entries(searchParams).forEach(([k, v]) => {
				if (k === "status") return;
				if (v === undefined || v === null) return;
				if (Array.isArray(v)) {
					if (v.length === 0) return;
					params.set(k, v.join(","));
				} else {
					const sv = String(v);
					if (sv.length === 0) return;
					params.set(k, sv);
				}
			});
		}

		if (status && status !== "all") {
			params.set("status", status);
		}

		const qs = params.toString();
		return qs ? `?${qs}` : ".";
	};

	// filter server-renderable list using the same status logic
	const filtered = (data ?? []).filter((conf) => {
		if (!conf) return false;
		if (activeStatus === "all") return true;
		const s = getConferenceStatus(conf, now);
		return s === activeStatus;
	});

	const paramsForFilter = {
		...(searchParams ?? {}),
		status: activeStatus === "all" ? undefined : activeStatus,
	};
	const sorted = filterAndSortConferences(
		filtered as ConferenceItem[],
		paramsForFilter,
	);

	return (
		<div className="flex w-full flex-col items-center gap-2">
			<Card
				className={cn(
					"pointer-events-auto w-full transform-gpu overflow-hidden transition-all duration-300 ease-in-out",
					"sm:h-full",
				)}
			>
				{/* Header with title only — controls live below for better responsivity */}
				<CardHeader className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center justify-center sm:justify-start">
						<CardTitle className="text-center sm:text-left">
							Conferences {year ? `· ${year}` : null}
						</CardTitle>
					</div>
				</CardHeader>

				{/* Responsive filter row placed under the title:
				    - on small screens: horizontally scrollable, padded, centered
				    - on tablet/desktop: inline centered row with equal spacing
				*/}
				<div className="px-4 pb-2">
					<nav
						className="mx-auto flex w-full max-w-full items-center gap-2 overflow-x-auto whitespace-nowrap py-1 sm:max-w-none sm:justify-center"
						aria-label="Conference status filters"
					>
						{/* visually hide default scrollbar but keep native scroll for accessibility */}
						{STATUS_FILTERS.map((f) => {
							const isActive = activeStatus === f.key;
							const count = counts[f.key as keyof typeof counts] ?? 0;
							return (
								<Link
									key={f.key}
									href={buildHref(f.key)}
									className={cn(
										"inline-flex shrink-0 items-center justify-center rounded-md px-3 py-1 font-medium text-sm transition-colors",
										isActive
											? "bg-accent/95 text-accent-foreground shadow-sm"
											: "border border-transparent text-muted-foreground hover:bg-muted/30",
									)}
								>
									<span className="flex items-center gap-2 whitespace-nowrap">
										<span>{f.label}</span>
										{f.key !== "all" && (
											<span className="text-muted-foreground text-xs">
												({count})
											</span>
										)}
									</span>
								</Link>
							);
						})}
					</nav>
				</div>

				{/* content */}
				<div className="scrollbar-hide flex max-h-[calc(100svh-180px)] flex-col gap-3 overflow-y-scroll px-4 pt-1 pb-6">
					{sorted && sorted.length > 0 ? (
						sorted.map((conference) => {
							if (!conference) return null;
							return <ConferenceCard key={conference.id} {...conference} />;
						})
					) : (
						<div className="text-center text-muted-foreground text-sm">
							<p>No conferences found for {year}.</p>
							{searchParams?.search && (
								<p className="mt-2">Try adjusting your search terms.</p>
							)}
						</div>
					)}
				</div>
			</Card>
		</div>
	);
};

export default ConferencesDisplay;
