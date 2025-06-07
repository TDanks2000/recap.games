export const getPrimaryYouTubeTitleSegment = (
  fullTitle: string | undefined | null,
): string => {
  if (!fullTitle) {
    return "";
  }
  return fullTitle.split(/[|\-–—([]/)?.[0]?.trim() ?? "";
};
