export function truncateText(
	text: string | undefined | null,
	maxLength: number,
	ellipsis = "...",
): string {
	if (!text) return "";
	if (text.length <= maxLength) {
		return text;
	}
	const effectiveMaxLength = maxLength - ellipsis.length;
	if (effectiveMaxLength <= 0) return ellipsis;

	let truncated = text.substring(0, effectiveMaxLength);
	const lastSpaceIndex = truncated.lastIndexOf(" ");
	if (lastSpaceIndex > 0) {
		truncated = truncated.substring(0, lastSpaceIndex);
	}
	return truncated + ellipsis;
}
