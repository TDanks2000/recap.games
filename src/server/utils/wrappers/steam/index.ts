import type {
	SteamApiResponse,
	SteamStoreData,
	StoreSearchItem,
	StoreSearchResponse,
} from "@/server/@types";

export type Locale = string;
export type Country = string;

export class SteamWrapper {
	private static instance: SteamWrapper;
	private readonly locale: Locale;
	private readonly country: Country;
	private readonly baseStoreUrl = "https://store.steampowered.com";

	constructor(opts?: { locale?: Locale; country?: Country }) {
		this.locale = opts?.locale ?? "en";
		this.country = opts?.country ?? "us";
	}

	public static getInstance(): SteamWrapper {
		if (!SteamWrapper.instance) {
			SteamWrapper.instance = new SteamWrapper();
		}
		return SteamWrapper.instance;
	}

	private constFetch = async (input: string): Promise<Response> => {
		if (typeof fetch === "undefined") {
			throw new Error("Global fetch is not available in this runtime.");
		}
		return fetch(input, { headers: { "User-Agent": "steam-wrapper/1.0" } });
	};

	searchStore = async (
		term: string,
		limit = 25,
	): Promise<Array<StoreSearchItem> | null> => {
		try {
			const q = encodeURIComponent(term);
			const url = `${this.baseStoreUrl}/api/storesearch?cc=${this.country}&l=${this.locale}&term=${q}&num_per_page=${limit}`;
			const res = await this.constFetch(url);
			if (!res.ok) {
				throw new Error(`Store search request failed: ${res.status}`);
			}
			const json: StoreSearchResponse = await res.json();

			return json.items;
		} catch (error) {
			console.error("Failed to fetch Steam store search info:", error);
			return null;
		}
	};

	getAppDetails = async (
		appid: number | string,
	): Promise<{ success: boolean; data: SteamStoreData } | null> => {
		const idStr = String(appid);
		try {
			const url = `${this.baseStoreUrl}/api/appdetails/?appids=${encodeURIComponent(idStr)}`;
			const fetched = await this.constFetch(url);

			const res = (await fetched.json()) as SteamApiResponse;
			const entry = res[idStr];
			return entry ?? null;
		} catch (error) {
			console.error("Failed to fetch Steam store info:", error);
			return null;
		}
	};
}
