"use client";

import { ArrowUpNarrowWide } from "lucide-react";
import { useId } from "react";
import type { SortOption } from "@/@types";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGamesSort } from "@/hooks/use-games-sort";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
	{ label: "Date Added", value: "date_added" },
	{ label: "Release Date", value: "releaseDate" },
	{ label: "Title", value: "title" },
];

type Props = {
	directionOnLeft?: boolean;
};

export default function GamesSortClient({ directionOnLeft }: Props) {
	const { currentSort, currentDirection, onSortChange, toggleDirection } =
		useGamesSort();

	return (
		<div className="flex w-full items-center gap-2 sm:w-[260px]">
			<div
				className={cn("flex-1", {
					"order-2": directionOnLeft,
				})}
			>
				<Select
					value={currentSort}
					onValueChange={(val) =>
						onSortChange(val as SortOption, currentDirection)
					}
				>
					<SelectTrigger
						id={useId()}
						className="w-full"
						name="sort games"
						aria-label="Sort games"
					>
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						{SORT_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<Button
				type="button"
				variant="outline"
				size="sm"
				className={cn("size-9 p-0", {
					"order-1": directionOnLeft,
				})}
				aria-label={
					currentDirection === "asc" ? "Sort ascending" : "Sort descending"
				}
				onClick={toggleDirection}
			>
				<ArrowUpNarrowWide
					className={cn("transition-all", {
						"rotate-180": currentDirection === "asc",
					})}
				/>
			</Button>
		</div>
	);
}
