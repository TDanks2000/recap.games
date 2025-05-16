export interface PaginationOptions {
	search?: string | undefined;
	page?: number | undefined;
	limit?: number | undefined;
}

export type HomeSearchParams = {
	conferences?: string;
	sort?: string;
	direction?: string;
};
