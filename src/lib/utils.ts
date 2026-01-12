import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { HomeSearchParams } from "@/@types";
import { Feature } from "@/@types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getYearFromSearchParams(
	searchParams: HomeSearchParams,
): number {
	const yearParam = searchParams.year;
	if (yearParam && typeof yearParam === "string") {
		const parsedYear = Number.parseInt(yearParam, 10);
		if (!Number.isNaN(parsedYear)) {
			return parsedYear;
		}
	}
	return 2025;
}

export const getIdFromURL = (
	link: string | null | undefined,
): string | null => {
	if (!link) return null;

	try {
		const url = new URL(link);
		const vParam = url.searchParams.get("v");
		if (vParam) return vParam;

		if (url.hostname === "youtu.be") {
			const id = url.pathname.slice(1);
			return id || null;
		}

		const pathSegments = url.pathname
			.split("/")
			.filter((seg) => seg.length > 0);
		for (let i = 0; i < pathSegments.length; i++) {
			if (
				(pathSegments[i] === "embed" || pathSegments[i] === "v") &&
				pathSegments[i + 1]
			) {
				const id = pathSegments[i + 1];
				return id ?? null;
			}
		}

		return null;
	} catch {
		const regex =
			/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&"'>]+)/;
		const match = link.match(regex);
		return match?.[1] ?? null;
	}
};

export const getImageFromURL = (
	link: string | null | undefined,
): string | null => {
	if (!link) return null;

	try {
		const url = new URL(link);
		const host = url.host.replaceAll("www.", "");

		switch (host) {
			case "youtube.com":
			case "youtu.be": {
				const id = getIdFromURL(link);
				return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : link;
			}
			default:
				return link;
		}
	} catch {
		return link;
	}
};

/**
 * Normalizes and combines features for better UI/UX display.
 * @param features Array of feature strings (any casing)
 * @returns Array of user-friendly feature strings
 */
export function combineFeatures(features: string[]): string[] {
	// Normalize input to lowercase and filter valid features
	const normalized = features
		.map((f) => f.trim().toLowerCase())
		.map((f) => (f === "coop" ? "co-op" : f)) // handle "coop" as "co-op"
		.filter((f) => Object.values(Feature).includes(f as Feature)) as Feature[];

	const set = new Set(normalized);
	const result: string[] = [];

	// Play mode grouping
	const hasSingle = set.has(Feature.Singleplayer);
	const hasMulti = set.has(Feature.Multiplayer);
	const hasCoop = set.has(Feature.Coop);

	if (hasSingle && hasMulti && hasCoop) {
		result.push("Single, Multi & Co-op");
	} else if (hasSingle && hasMulti) {
		result.push("Single & Multiplayer");
	} else if (hasSingle && hasCoop) {
		result.push("Singleplayer & Co-op");
	} else if (hasMulti && hasCoop) {
		result.push("Multiplayer & Co-op");
	} else if (hasSingle) {
		result.push("Singleplayer");
	} else if (hasMulti) {
		result.push("Multiplayer");
	} else if (hasCoop) {
		result.push("Co-op");
	}

	// Content grouping
	const hasUpdate = set.has(Feature.Update);
	const hasDLC = set.has(Feature.DLC);

	if (hasUpdate && hasDLC) {
		result.push("Updates & DLC");
	} else if (hasUpdate) {
		result.push("Updates");
	} else if (hasDLC) {
		result.push("DLC");
	}

	return result;
}
