import { cache, useMemo } from "react";

export interface ReadingTimeOptions {
	wordsPerMinute?: number;
	includeCodeBlocks?: boolean;
	contentType?: "fiction" | "non-fiction";
	locale?: string;
}

export interface ReadingTimeResult {
	minutes: number;
	seconds: number;
	words: number;
	text: string;
	formattedTime: string;
}

const AVERAGE_NON_FICTION_WPM = 186;

const getAdjustedWpm = (
	baseWpm: number,
	contentType: "fiction" | "non-fiction",
): number => {
	if (contentType === "fiction") {
		return baseWpm * 1.09;
	}
	return baseWpm;
};

const stripHtml = (content: string): string => {
	return content.replace(/<[^>]*>/g, " ");
};

const countWords = (content: string, locale: string): number => {
	if (typeof Intl.Segmenter === "function") {
		const segmenter = new Intl.Segmenter(locale, {
			granularity: "word",
		});
		return Array.from(segmenter.segment(content)).filter(
			(segment) => segment.isWordLike,
		).length;
	}
	return content.trim().split(/\s+/).length;
};

const formatTime = (
	minutes: number,
	seconds: number,
	locale: string,
): string => {
	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

	if (minutes > 0) {
		return rtf.format(minutes, "minute");
	}
	return rtf.format(seconds, "second");
};

export const getReadingTime = cache(
	(content: string, options: ReadingTimeOptions = {}): ReadingTimeResult => {
		const {
			includeCodeBlocks = false,
			contentType = "non-fiction",
			locale = "en",
		} = options;

		if (!content?.trim()) {
			return {
				minutes: 0,
				seconds: 0,
				words: 0,
				text: "0 min read",
				formattedTime: "0 minutes",
			};
		}

		let processedContent = stripHtml(content);

		if (!includeCodeBlocks) {
			processedContent = processedContent
				.replace(/```[\s\S]*?```/g, "")
				.replace(/`[^`]*`/g, "");
		}

		const wordCount = countWords(processedContent, locale);

		const baseWpm = options.wordsPerMinute || AVERAGE_NON_FICTION_WPM;
		const adjustedWpm = getAdjustedWpm(baseWpm, contentType);

		const totalSeconds = Math.round((wordCount / adjustedWpm) * 60);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		const finalMinutes = wordCount > 0 ? Math.max(1, minutes) : 0;

		return {
			minutes: finalMinutes,
			seconds,
			words: wordCount,
			text: `${finalMinutes} min read`,
			formattedTime: formatTime(finalMinutes, seconds, locale),
		};
	},
);

export const useReadingTime = (
	content: string,
	options?: ReadingTimeOptions,
) => {
	return useMemo(() => getReadingTime(content, options), [content, options]);
};
