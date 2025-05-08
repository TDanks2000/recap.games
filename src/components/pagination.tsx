"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface PaginationProps {
	totalResults: number;
	current: number;
	pageSize: number;
	maxNumbers?: number;
}

const Pagination = ({
	totalResults,
	current,
	pageSize,
	maxNumbers = 5,
}: PaginationProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const totalPages = Math.ceil(totalResults / pageSize);

	if (totalPages <= 1) return null;

	const changePage = (page: number) => {
		if (page < 1 || page > totalPages) return;

		const params = new URLSearchParams(searchParams.toString());
		params.set("page", page.toString());
		router.push(`${pathname}?${params.toString()}`);
	};

	const generatePageNumbers = () => {
		let start = Math.max(1, current - Math.floor(maxNumbers / 2));
		const end = Math.min(totalPages, start + maxNumbers - 1);

		if (end - start + 1 < maxNumbers) {
			start = Math.max(1, end - maxNumbers + 1);
		}

		return Array.from({ length: end - start + 1 }, (_, i) => {
			const page = start + i;
			const isActive = page === current;

			return (
				<Button
					key={page}
					size="icon"
					variant={isActive ? "default" : "ghost"}
					className={cn("w-9 transition-all", { "scale-105": isActive })}
					onClick={() => changePage(page)}
					aria-label={`Go to page ${page}`}
				>
					{page}
				</Button>
			);
		});
	};

	return (
		<div className="flex items-center gap-2">
			<Button
				size="icon"
				variant="ghost"
				disabled={current === 1}
				onClick={() => changePage(current - 1)}
				aria-label="Previous page"
			>
				<ChevronLeft />
			</Button>

			<div className="flex gap-1">{generatePageNumbers()}</div>

			<Button
				size="icon"
				variant="ghost"
				disabled={current >= totalPages}
				onClick={() => changePage(current + 1)}
				aria-label="Next page"
			>
				<ChevronRight />
			</Button>
		</div>
	);
};

export default Pagination;
