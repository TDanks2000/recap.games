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

	// Case-insensitive check for common terms like "TBA" or "TBD"
	// \b ensures "tba" is a whole word, not part of "disturbAnce"
	if (/\b(tba|tbd)\b/i.test(dateStr)) {
		return dateStr; // Return original string like "TBD 2025", "Release TBA"
	}

	// Specific patterns to return as-is
	const passthroughPatterns: RegExp[] = [
		/^Year \d{4}$/i, // "Year 2025"
		/^Q[1-4] \d{4}$/i, // "Q1 2025", "Q2 2025"
		/^\d{4}$/, // "2025" (just the year)
		/^(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?) \d{4}$/i, // "May 2025", "January 2025"
		// Add other patterns if needed, e.g., /^\d{4}-\d{2}$/ for "2025-05"
	];

	for (const pattern of passthroughPatterns) {
		if (pattern.test(dateStr)) {
			return dateStr;
		}
	}

	// Handle "Coming Soon" or other specific literal strings
	if (dateStr.toLowerCase() === "coming soon") {
		return dateStr;
	}

	// If it's not a special pattern, try to parse it as a full date
	const parsedDate = new Date(dateStr);

	if (isValid(parsedDate)) {
		// It's a valid date that wasn't caught by the passthrough patterns,
		// so it's likely a full date string like "2025-12-20" or "Dec 20, 2025".
		return format(parsedDate, "MMMM do, yyyy");
	}
	// If it's not a recognized pattern and not a valid date, return the original string.
	// This covers "Invalid Date String", "TDB 2025" (if TDB isn't in keywords), etc.
	return dateStr;
}
