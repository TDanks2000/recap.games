import { type Genre, MediaType, type Platform } from "@/@types";
import type { GameFormInitialData } from "@/features/admin/components/GameForm";
import { formatReleaseDate } from "@/lib/formatReleaseDate";
import type { RouterOutputs } from "@/trpc/react";
import {
	extractFeatures,
	isSteamData,
	mapGenres,
	mapPlatforms,
} from "./gameDataMapper";

type IGDBInfo = NonNullable<RouterOutputs["igdb"]["info"]>;
type SteamInfo = NonNullable<RouterOutputs["steam"]["getAppDetails"]>;

/**
 * Safely extract array of strings from various input types
 */
function extractStringArray(input: string[] | string | undefined): string[] {
	if (!input) return [];
	return Array.isArray(input) ? input : [input];
}

/**
 * Get raw platform strings from API data
 */
function getRawPlatforms(data: IGDBInfo | SteamInfo): string[] {
	if (isSteamData(data)) {
		const platforms: string[] = [];
		if (data.data.platforms?.windows) platforms.push("Windows");
		if (data.data.platforms?.mac) platforms.push("Mac");
		if (data.data.platforms?.linux) platforms.push("Linux");
		return platforms;
	}
	return data.platforms?.map((p) => p.name) ?? [];
}

/**
 * Get raw genre strings from API data
 */
function getRawGenres(data: IGDBInfo | SteamInfo): string[] {
	if (isSteamData(data)) {
		return data.data.genres?.map((g) => g.description) ?? [];
	}
	return data.genres?.map((g) => g.name) ?? [];
}

/**
 * Get screenshots/media from game data
 */
function _getScreenshots(data: IGDBInfo | SteamInfo): string[] {
	if (isSteamData(data)) {
		return data.data.screenshots?.map((s) => s.path_full) ?? [];
	}
	return (
		data.screenshots?.map(
			(s) =>
				`https://images.igdb.com/igdb/image/upload/t_screenshot_big/${s.image_id}.jpg`,
		) ?? []
	);
}

/**
 * Get video/trailer URLs
 */
function getVideos(data: IGDBInfo | SteamInfo): string[] {
	if (isSteamData(data)) {
		return [];
	}
	return (
		data.videos?.map((v) => `https://www.youtube.com/watch?v=${v.video_id}`) ??
		[]
	);
}

/**
 * Map API game data to GameFormInitialData with proper enum mapping
 * @param data - Game data from IGDB or Steam
 * @returns Mapped data ready for the game form
 */
export function mapGameDataToForm(
	data: IGDBInfo | SteamInfo,
): Partial<GameFormInitialData> {
	const isSteam = isSteamData(data);

	// Extract basic information
	const title = isSteam ? data.data.name : data.name;

	// Extract developers
	const developers = isSteam
		? extractStringArray(data.data.developers)
		: (data.involved_companies
				?.filter((company) => company.developer)
				.map((dev) => dev?.company?.name)
				.filter(Boolean) ?? []);

	// Extract publishers
	const publishers = isSteam
		? extractStringArray(data.data.publishers)
		: (data.involved_companies
				?.filter((company) => company.publisher)
				.map((pub) => pub?.company?.name)
				.filter(Boolean) ?? []);

	// Format release date
	const rawReleaseDate = isSteam
		? data.data.release_date?.date
		: data.first_release_date;
	const releaseDate = formatReleaseDate(rawReleaseDate);

	// Get raw strings from API
	const rawPlatforms = getRawPlatforms(data);
	const rawGenres = getRawGenres(data);

	// Map to enums with fuzzy matching
	const exclusive = mapPlatforms(rawPlatforms);
	const genres = mapGenres(rawGenres);
	const features = extractFeatures(data);
	const videos = getVideos(data);

	return {
		title,
		developer: developers,
		publisher: publishers,
		releaseDate,
		exclusive,
		genres,
		features,
		media: videos?.map((video) => ({
			link: video,
			type: MediaType.Video,
		})),
	};
}

/**
 * Get a summary of the mapping for debugging/logging
 */
export function getMapperSummary(
	originalData: { platforms: string[]; genres: string[] },
	mappedData: { platforms: Platform[]; genres: Genre[] },
) {
	return {
		platforms: {
			original: originalData.platforms,
			mapped: mappedData.platforms,
			unmapped: originalData.platforms.filter(
				(p) =>
					!mappedData.platforms.some((mp) =>
						p.toLowerCase().includes(mp.toLowerCase()),
					),
			),
		},
		genres: {
			original: originalData.genres,
			mapped: mappedData.genres,
			unmapped: originalData.genres.filter(
				(g) =>
					!mappedData.genres.some((mg) =>
						g.toLowerCase().includes(mg.toLowerCase()),
					),
			),
		},
	};
}
