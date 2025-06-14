"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";

type PaginationControlsProps = {
	totalPages: number;
	currentPage: number;
};

export function PaginationControls({
	totalPages,
	currentPage,
}: PaginationControlsProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	if (totalPages <= 1) {
		return null;
	}

	const handlePageChange = (page: number) => {
		const currentParams = new URLSearchParams(
			Array.from(searchParams.entries()),
		);

		currentParams.set("page", String(page));

		router.push(`${pathname}?${currentParams.toString()}`);
	};

	return (
		<Pagination
			page={currentPage}
			totalPages={totalPages}
			onPageChange={handlePageChange}
		/>
	);
}
