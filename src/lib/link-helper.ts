/**
 * Finds all HTTP and HTTPS URLs in a given string of text.
 *
 * @param text The string of text to search for links.
 * @returns An array of strings, where each string is a URL found in the text.
 *          Returns an empty array if no links are found.
 */
function findLinks(text: string): string[] {
	// Regex to find URLs (http and https)
	// This regex looks for:
	// - http:// or https://
	// - Optional www.
	// - A domain name (e.g., example.com, store.steampowered.com)
	// - An optional path, query parameters, and fragment
	const urlRegex =
		/https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;
	const matches = text.match(urlRegex);
	return matches ? matches : [];
}

/**
 * Finds URLs from a text that contain a specific search term.
 * The search is case-insensitive.
 *
 * @param text The string of text to search for links.
 * @param searchTerm The term to look for within the found URLs.
 * @returns An array of URLs that contain the search term.
 *          Returns an empty array if no such links are found.
 */
export function findSpecificLinks(text: string, searchTerm: string): string[] {
	const allLinks = findLinks(text);

	if (!allLinks.length) {
		return [];
	}

	const lowerSearchTerm = searchTerm.toLowerCase();

	return allLinks.filter((link) =>
		link.toLowerCase().includes(lowerSearchTerm),
	);
}

export const getYouTubeEmbedUrl = (url: string | undefined): string | null => {
	if (!url) return null;
	try {
		const parsed = new URL(url);

		let videoId: string | null = null;

		if (parsed.hostname.includes("youtube.com")) {
			videoId = parsed.searchParams.get("v");
		} else if (parsed.hostname === "youtu.be") {
			videoId = parsed.pathname.slice(1);
		}

		return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
	} catch {
		return null;
	}
};
