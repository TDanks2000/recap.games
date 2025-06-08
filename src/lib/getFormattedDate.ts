import { format, isValid } from "date-fns";

/**
 * Formats a release date string for display.
 * Handles "TBA", specific patterns (e.g., "Year 2025", "Q2 2025", "2025", "May 2025"),
 * and fully parsable dates.
 * @param releaseDate The raw release date (string, Date, null, or undefined).
 * @returns A user-friendly string representation of the release date.
 */
export function getFormattedDate(
	releaseDateInput: string | Date | null | undefined,
): string {
	if (releaseDateInput === null || releaseDateInput === undefined) {
		return "TBA";
	}

	const dateStr = String(releaseDateInput).trim();

	if (dateStr === "") {
		return "TBA";
	}

	if (/\b(tba|tbd)\b/i.test(dateStr)) {
		return dateStr;
	}

	// Specific patterns to return as-is
	const passthroughPatterns: RegExp[] = [
		/^Year \d{4}$/i,
		/^Q[1-4] \d{4}$/i,
		/^\d{4}$/,
		/^(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?) \d{4}$/i,
		// Seasonal patterns
		/^(Winter|Spring|Summer|Fall|Autumn) \d{4}$/i,
		// Early/Late/Mid patterns
		/^(Early|Late|Mid) \d{4}$/i,
		// Holiday patterns
		/^(Holiday|Christmas) \d{4}$/i,
		// Coming Soon variations
		/^Coming Soon$/i,
	];

	for (const pattern of passthroughPatterns) {
		if (pattern.test(dateStr)) {
			return dateStr;
		}
	}

	// Handle other literal strings that should be returned as-is
	const literalStrings = ["coming soon", "tba", "tbd"];
	if (literalStrings.includes(dateStr.toLowerCase())) {
		return dateStr;
	}

	const parsedDate = new Date(dateStr);

	if (isValid(parsedDate)) {
		return format(parsedDate, "MMMM do, yyyy");
	}

	return dateStr;
}
