import { Feature, Genre, Platform } from "@/@types";
import type { RouterOutputs } from "@/trpc/react";

type IGDBInfo = NonNullable<RouterOutputs["igdb"]["info"]>;
type SteamInfo = NonNullable<RouterOutputs["steam"]["getAppDetails"]>;

/* ---------- Utility guards ---------- */
const isString = (v: unknown): v is string => typeof v === "string";
const isNumber = (v: unknown): v is number => typeof v === "number";

/* ---------- Levenshtein / similarity ---------- */
function levenshteinDistance(a: string, b: string): number {
	const m = a.length;
	const n = b.length;

	// initialize dp so every row exists and has length m+1
	const dp: number[][] = [];
	for (let i = 0; i <= n; i++) {
		dp[i] = new Array(m + 1).fill(0);
	}

	// helper that ensures dp[row] exists and returns it — explicit null/undefined guard
	const ensureRow = (rowIndex: number): number[] => {
		if (dp[rowIndex] === undefined || dp[rowIndex] === null) {
			dp[rowIndex] = new Array(m + 1).fill(0);
		}
		return dp[rowIndex];
	};

	// initialize first column and first row safely
	for (let i = 0; i <= n; i++) {
		const r = ensureRow(i);
		r[0] = i;
	}

	const r0 = ensureRow(0);
	for (let j = 0; j <= m; j++) {
		r0[j] = j;
	}

	for (let i = 1; i <= n; i++) {
		const rowI = ensureRow(i);
		const rowIM1 = ensureRow(i - 1);
		for (let j = 1; j <= m; j++) {
			// use nullish coalescing to ensure values are numbers (indexes are within 0..m)
			const left: number = rowI[j - 1] ?? 0;
			const diag: number = rowIM1[j - 1] ?? 0;
			const up: number = rowIM1[j] ?? 0;

			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				rowI[j] = diag;
			} else {
				rowI[j] = Math.min(diag + 1, left + 1, up + 1);
			}
		}
	}

	return ensureRow(n)[m] ?? 0;
}

function calculateSimilarity(str1: string, str2: string): number {
	const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
	const maxLength = Math.max(str1.length, str2.length);
	if (maxLength === 0) return 1;
	const raw = 1 - distance / maxLength;
	return Math.max(0, Math.min(1, raw));
}

/* ---------- Fuzzy match for enums (string/number enums) ---------- */
function fuzzyMatchEnum<T extends Record<string, unknown>>(
	input: string,
	enumObj: T,
	threshold = 0.7,
): T[keyof T] | null {
	const normalizedInput = input.toLowerCase().trim();
	let best: { value: T[keyof T]; score: number } | null = null;

	// only keep keys that are not numeric (filter out reverse mappings for numeric enums)
	const keys = Object.keys(enumObj).filter((k) => Number.isNaN(Number(k)));

	for (const key of keys) {
		const rawValue = enumObj[key as keyof T];
		const valueStr = String(rawValue).toLowerCase();
		const keyStr = key.toLowerCase();

		if (normalizedInput === valueStr || normalizedInput === keyStr) {
			return rawValue as T[keyof T];
		}

		if (
			valueStr.includes(normalizedInput) ||
			normalizedInput.includes(valueStr)
		) {
			const sim = calculateSimilarity(normalizedInput, valueStr);
			if (sim >= threshold && (!best || sim > best.score)) {
				best = { value: rawValue as T[keyof T], score: sim };
			}
			continue;
		}

		const sim = calculateSimilarity(normalizedInput, valueStr);
		if (sim >= threshold && (!best || sim > best.score)) {
			best = { value: rawValue as T[keyof T], score: sim };
		}
	}

	return best?.value ?? null;
}

/* ---------- Platform mapping ---------- */
export function mapPlatforms(platforms: string[] | undefined): Platform[] {
	if (!Array.isArray(platforms) || platforms.length === 0) return [];

	const mapped = new Set<Platform>();

	const platformAliases: Record<string, Platform> = {
		ps5: Platform.PlayStation,
		ps4: Platform.PlayStation,
		ps3: Platform.PlayStation,
		ps2: Platform.PlayStation,
		ps1: Platform.PlayStation,
		psx: Platform.PlayStation,
		playstation: Platform.PlayStation,
		"playstation 5": Platform.PlayStation,
		"playstation 4": Platform.PlayStation,
		"sony playstation": Platform.PlayStation,

		xbox: Platform.Xbox,
		"xbox one": Platform.Xbox,
		"xbox 360": Platform.Xbox,
		"xbox series x": Platform.Xbox,
		"xbox series s": Platform.Xbox,
		xb1: Platform.Xbox,
		"microsoft xbox": Platform.Xbox,

		switch: Platform.Nintendo,
		"nintendo switch": Platform.Nintendo,
		wii: Platform.Nintendo,
		"wii u": Platform.Nintendo,
		"3ds": Platform.Nintendo,
		ds: Platform.Nintendo,
		"game boy": Platform.Nintendo,
		gameboy: Platform.Nintendo,

		pc: Platform.PC,
		windows: Platform.PC,
		linux: Platform.PC,
		mac: Platform.PC,
		macos: Platform.PC,
		steam: Platform.PC,
		"epic games": Platform.PC,

		ios: Platform.IOS,
		iphone: Platform.IOS,
		ipad: Platform.IOS,
		"apple ios": Platform.IOS,

		android: Platform.Android,
		"google play": Platform.Android,
	};

	for (const raw of platforms) {
		if (!isString(raw)) continue;
		const normalized = raw.toLowerCase().trim();

		// check alias using Object.hasOwn to avoid prototype builtins
		if (Object.hasOwn(platformAliases, normalized)) {
			const platform =
				platformAliases[normalized as keyof typeof platformAliases];
			if (platform !== undefined && platform !== null) mapped.add(platform);
			continue;
		}

		const matched = fuzzyMatchEnum(normalized, Platform, 0.72);
		if (matched !== null) {
			mapped.add(matched as Platform);
		} else {
			// Add Other only if it exists on the enum and is defined
			if (Object.hasOwn(Platform, "Other")) {
				const other = (Platform as unknown as Record<string, Platform>).Other;
				if (other !== undefined && other !== null) mapped.add(other);
			}
		}
	}

	return Array.from(mapped);
}

/* ---------- Genre mapping ---------- */
export function mapGenres(genres: string[] | undefined): Genre[] {
	if (!Array.isArray(genres) || genres.length === 0) return [];

	const mapped = new Set<Genre>();

	const genreAliases: Record<string, Genre> = {
		"role-playing": Genre.RPG,
		"role playing": Genre.RPG,
		"role-playing (rpg)": Genre.RPG,
		rpg: Genre.RPG,

		fps: Genre.FPS,
		"first-person shooter": Genre.FPS,
		"first person shooter": Genre.FPS,

		rts: Genre.RTS,
		"real-time strategy": Genre.RTS,
		"real time strategy": Genre.RTS,

		mmo: Genre.MMO,
		mmorpg: Genre.MMO,
		"massively multiplayer": Genre.MMO,

		moba: Genre.MOBA,
		"multiplayer online battle arena": Genre.MOBA,

		"beat 'em up": Genre.BeatEmUp,
		"beat em up": Genre.BeatEmUp,
		brawler: Genre.BeatEmUp,

		"visual novel": Genre.VisualNovel,

		"hack and slash": Genre.Action,
		"hack-and-slash": Genre.Action,

		indie: Genre.Other,
		arcade: Genre.Casual,
		point: Genre.Adventure,
		"point-and-click": Genre.Adventure,
		"turn-based": Genre.Strategy,
		tactical: Genre.Strategy,
		pinball: Genre.Casual,
		quiz: Genre.Trivia,
	};

	for (const raw of genres) {
		if (!isString(raw)) continue;
		const normalized = raw.toLowerCase().trim();

		if (Object.hasOwn(genreAliases, normalized)) {
			const genre = genreAliases[normalized as keyof typeof genreAliases];
			if (genre !== undefined && genre !== null) mapped.add(genre);
			continue;
		}

		const matched = fuzzyMatchEnum(normalized, Genre, 0.7);
		if (matched !== null) {
			mapped.add(matched as Genre);
		} else {
			if (Object.hasOwn(Genre, "Other")) {
				const other = (Genre as unknown as Record<string, Genre>).Other;
				if (other !== undefined && other !== null) mapped.add(other);
			}
		}
	}

	return Array.from(mapped);
}

/* ---------- Feature extraction ---------- */
export function extractFeatures(data: IGDBInfo | SteamInfo): Feature[] {
	const features = new Set<Feature>();

	if (isSteamData(data)) {
		// steam response shape: { success: boolean, data: { ... } }
		const steamData = data.data ?? undefined;

		// categories: safe extraction & normalization
		let categories: string[] = [];
		if (
			steamData !== undefined &&
			Array.isArray((steamData as Record<string, unknown>).categories)
		) {
			const arr = (steamData as Record<string, unknown>)
				.categories as unknown[];
			categories = arr
				.map((c) => {
					if (
						c &&
						typeof c === "object" &&
						Object.hasOwn(c as Record<string, unknown>, "description")
					) {
						const desc = (c as Record<string, unknown>).description;
						return isString(desc) ? desc.toLowerCase() : undefined;
					}
					return undefined;
				})
				.filter(isString);
		}

		if (
			categories.some(
				(c) => c.includes("single-player") || c.includes("single player"),
			)
		) {
			features.add(Feature.Singleplayer);
		}
		if (
			categories.some(
				(c) => c.includes("multi-player") || c.includes("multiplayer"),
			)
		) {
			features.add(Feature.Multiplayer);
		}
		if (categories.some((c) => c.includes("co-op") || c.includes("coop"))) {
			features.add(Feature.Coop);
		}

		// dlc on steam may be array-ish
		const steamDLC =
			steamData !== undefined
				? (steamData as Record<string, unknown>).dlc
				: undefined;
		if (Array.isArray(steamDLC) && steamDLC.length > 0) {
			features.add(Feature.DLC);
		}
	} else {
		// IGDB shape: check game_modes and dlcs defensively
		const igdb = data as IGDBInfo;

		const gameModes: number[] = Array.isArray(igdb.game_modes)
			? igdb.game_modes.filter(isNumber)
			: [];

		// known mapping: 1 single, 2 multiplayer, 3 coop (leave it flexible)
		if (gameModes.includes(1)) features.add(Feature.Singleplayer);
		if (gameModes.includes(2)) features.add(Feature.Multiplayer);
		if (gameModes.includes(3)) features.add(Feature.Coop);

		if (Array.isArray(igdb.dlcs) && igdb.dlcs.length > 0)
			features.add(Feature.DLC);
	}

	return Array.from(features);
}

/**
 * Type guard for Steam data
 */
export function isSteamData(game: IGDBInfo | SteamInfo): game is SteamInfo {
	return (
		typeof game === "object" &&
		game !== null &&
		Object.hasOwn(game as Record<string, unknown>, "success") &&
		typeof (game as Record<string, unknown>).success === "boolean"
	);
}
