/**
 * Formats a release date to MM-DD-YYYY format or returns the original string if already formatted
 * @param dateInput - Can be a Date object, Unix timestamp (number), or string (MM-DD-YYYY or text like "Q4 2023")
 * @returns Formatted date string in MM-DD-YYYY format or the original text format
 */
export function formatReleaseDate(
	dateInput: Date | number | string | undefined | null,
): string | undefined {
	if (!dateInput) {
		return undefined;
	}

	// If it's already a string, check if it's in a valid format or text format
	if (typeof dateInput === "string") {
		// Check if it matches MM-DD-YYYY or M-D-YYYY pattern
		const datePattern = /^\d{1,2}-\d{1,2}-\d{4}$/;
		if (datePattern.test(dateInput)) {
			return dateInput;
		}

		// Check if it's a text format like "Q4 2023", "TBA", "Coming Soon", etc.
		if (/^[A-Za-z]/.test(dateInput)) {
			return dateInput;
		}

		// Try to parse it as a date string
		const parsedDate = new Date(dateInput);
		if (!isNaN(parsedDate.getTime())) {
			return formatDateToMMDDYYYY(parsedDate);
		}

		// If we can't parse it, return as-is
		return dateInput;
	}

	// If it's a number, treat it as Unix timestamp
	if (typeof dateInput === "number") {
		// Check if it's in seconds (Unix timestamp) or milliseconds
		const timestamp = dateInput < 10000000000 ? dateInput * 1000 : dateInput;
		const date = new Date(timestamp);

		if (isNaN(date.getTime())) {
			return undefined;
		}

		return formatDateToMMDDYYYY(date);
	}

	// If it's a Date object
	if (dateInput instanceof Date) {
		if (isNaN(dateInput.getTime())) {
			return undefined;
		}
		return formatDateToMMDDYYYY(dateInput);
	}

	return undefined;
}

/**
 * Helper function to format a Date object to MM-DD-YYYY
 */
function formatDateToMMDDYYYY(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const year = date.getFullYear();
	return `${month}-${day}-${year}`;
}

/**
 * Formats a quarter date (like "Q4 2023") from a date object
 * Useful for games that only have quarter/year information
 */
export function formatToQuarterYear(
	dateInput: Date | number | undefined | null,
): string | undefined {
	if (!dateInput) {
		return undefined;
	}

	const date =
		typeof dateInput === "number"
			? new Date(dateInput < 10000000000 ? dateInput * 1000 : dateInput)
			: dateInput;

	if (!(date instanceof Date) || isNaN(date.getTime())) {
		return undefined;
	}

	const month = date.getMonth();
	const year = date.getFullYear();

	// Determine quarter based on month (0-indexed)
	const quarter = Math.floor(month / 3) + 1;

	return `Q${quarter} ${year}`;
}
