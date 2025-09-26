import type { RouterOutputs } from "@/trpc/react";

export interface PaginationOptions {
	search?: string | undefined;
	page?: number | undefined;
	limit?: number | undefined;
}

export type Game = RouterOutputs["game"]["getAll"]["items"][number];
export type SortOption = "title" | "releaseDate" | "date_added";
export type SortDirection = "asc" | "desc";

export type HomeSearchParams = {
	conferences?: string;
	sort?: SortOption;
	direction?: SortDirection;
	conferenceOpen?: "true" | "false";
	search?: string;
	page?: number | string;
	year?: string;
	status?: string;
};
