export type SteamStoreData = {
	type: string;
	name: string;
	steam_appid: number;
	required_age: number;
	is_free: boolean;
	controller_support: string;
	dlc: number[];
	detailed_description: string;
	about_the_game: string;
	short_description: string;
	supported_languages: string;
	header_image: string;
	capsule_image: string;
	capsule_imagev5: string;
	website: string;
	pc_requirements: PcRequirements;
	mac_requirements: PcRequirements;
	linux_requirements: PcRequirements;
	developers: string[];
	publishers: string[];
	demos: { appid: number; description: string }[];
	price_overview: {
		currency: string;
		initial: number;
		final: number;
		discount_percent: number;
		initial_formatted: string;
		final_formatted: string;
	};
	packages: number[];
	package_groups: {
		name: string;
		title: string;
		description: string;
		selection_text: string;
		save_text: string;
		display_type: number;
		is_recurring_subscription: string;
		subs: {
			packageid: number;
			percent_savings_text: string;
			percent_savings: number;
			option_text: string;
			option_description: string;
			can_get_free_license: string;
			is_free_license: boolean;
			price_in_cents_with_discount: number;
		}[];
	}[];
	platforms: {
		windows: boolean;
		mac: boolean;
		linux: boolean;
	};
	metacritic: {
		score: number;
		url: string;
	};
	categories: { id: number; description: string }[];
	genres: { id: string; description: string }[];
	screenshots: {
		id: number;
		path_thumbnail: string;
		path_full: string;
	}[];
	movies: {
		id: number;
		name: string;
		thumbnail: string;
		webm: {
			480: string;
			max: string;
		};
		mp4: {
			480: string;
			max: string;
		};
		highlight: boolean;
	}[];
	recommendations: {
		total: number;
	};
	achievements: {
		total: number;
		highlighted: {
			name: string;
			path: string;
		}[];
	};
	release_date: {
		coming_soon: boolean;
		date: string;
	};
	support_info: {
		url: string;
		email: string;
	};
	background: string;
	background_raw: string;
	content_descriptors: {
		ids: number[];
		notes: string | null;
	};
	ratings: {
		usk: {
			rating: string;
		};
		agcom: {
			rating: string;
			descriptors: string;
		};
	};
};

export interface PcRequirements {
	minimum?: string;
	recommended?: string;
}

export type SteamApiResponse = {
	[appid: string]: {
		success: boolean;
		data: SteamStoreData;
	};
};

export interface StoreSearchItemPrice {
	currency: string;
	initial: number; // smallest currency unit, e.g. cents
	final: number; // smallest currency unit
	discount_percent?: number | null;
}

/** Platform support flags returned by search results */
export interface StoreSearchPlatforms {
	windows: boolean;
	mac: boolean;
	linux: boolean;
}

export interface StoreSearchItem {
	type: "app" | string;
	name: string;
	id: number;
	price?: StoreSearchItemPrice;
	tiny_image?: string;
	metascore?: string;
	platforms: StoreSearchPlatforms;
	streamingvideo?: boolean;
	controller_support?: "full" | "partial" | "none" | string;
	url?: string;
}

export interface StoreSearchResponse {
	total: number;
	items: Array<StoreSearchItem>;
}
