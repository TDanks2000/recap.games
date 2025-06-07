export const getPrimaryYouTubeTitleSegment = (
	fullTitle: string | undefined | null,
): string => {
	if (!fullTitle) return "";
	const primarySegment = fullTitle.split(/[|:\-–—([]/)?.[0] ?? "";
	return primarySegment.replace(/\b(official trailer|trailer)\b/gi, "").trim();
};
