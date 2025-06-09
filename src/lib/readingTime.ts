import { cache, useMemo } from "react";

interface ReadingTimeOptions {
	wordsPerMinute?: number;
	includeCodeBlocks?: boolean;
	contentType?: "blog" | "technical" | "casual";
	locale?: string;
}

interface ReadingTimeResult {
	minutes: number;
	seconds: number;
	words: number;
	text: string;
	formattedTime: string;
}

const getReadingTime = cache(
	(content: string, options: ReadingTimeOptions = {}): ReadingTimeResult => {
		const {
			wordsPerMinute = 200,
			includeCodeBlocks = false,
			contentType = "blog",
			locale = "en",
		} = options;

		// Handle empty content
		if (!content?.trim()) {
			return {
				minutes: 0,
				seconds: 0,
				words: 0,
				text: "0 min read",
				formattedTime: "0 minutes",
			};
		}

		let processedContent = content;

		// Strip HTML tags for accurate word count
		processedContent = processedContent.replace(/<[^>]*>/g, " ");

		// Optionally remove code blocks (they're read slower)
		if (!includeCodeBlocks) {
			processedContent = processedContent
				.replace(/```[\s\S]*?```/g, "") // Remove code blocks
				.replace(/`[^`]*`/g, ""); // Remove inline code
		}

		// Better word counting with improved regex
		const words = processedContent
			.trim()
			.split(/\s+/)
			.filter((word) => {
				// Filter out empty strings and pure punctuation
				const cleanWord = word.replace(/[^\w]/g, "");
				return cleanWord.length > 0;
			});

		const wordCount = words.length;

		// Adjust reading speed based on content type
		const adjustedWPM = getAdjustedReadingSpeed(wordsPerMinute, contentType);

		// Calculate time more precisely
		const totalSeconds = Math.ceil((wordCount / adjustedWPM) * 60);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		// Ensure minimum reading time for substantial content
		const finalMinutes = wordCount > 0 ? Math.max(1, minutes) : 0;
		const finalSeconds = finalMinutes === 1 && minutes === 0 ? seconds : 0;

		// Generate various text formats
		const shortText = generateShortText(finalMinutes, finalSeconds);
		const formattedTime = generateFormattedTime(
			finalMinutes,
			finalSeconds,
			locale,
		);

		return {
			minutes: finalMinutes,
			seconds: finalSeconds,
			words: wordCount,
			text: shortText,
			formattedTime,
		};
	},
);

// Helper function to adjust reading speed based on content type
const getAdjustedReadingSpeed = (
	baseWPM: number,
	contentType: string,
): number => {
	const multipliers = {
		casual: 1.1, // Casual content is read faster
		blog: 1.0, // Standard blog content
		technical: 0.8, // Technical content is read slower
	};

	return (
		baseWPM * (multipliers[contentType as keyof typeof multipliers] || 1.0)
	);
};

// Generate concise reading time text
const generateShortText = (minutes: number, seconds: number): string => {
	if (minutes === 0) return "< 1 min read";
	if (minutes === 1 && seconds < 30) return "1 min read";
	if (minutes < 5) return `${minutes} min read`;

	// Round to nearest 5 minutes for longer content
	const roundedMinutes = Math.round(minutes / 5) * 5;
	return `${roundedMinutes} min read`;
};

// Generate detailed formatted time
const generateFormattedTime = (
	minutes: number,
	seconds: number,
	_locale: string,
): string => {
	if (minutes === 0) {
		return `${seconds} seconds`;
	}

	if (minutes === 1) {
		return seconds > 0 ? `1 minute ${seconds} seconds` : "1 minute";
	}

	return seconds > 0
		? `${minutes} minutes ${seconds} seconds`
		: `${minutes} minutes`;
};

// Hook version for component usage with memoization
const useReadingTime = (content: string, options?: ReadingTimeOptions) => {
	return useMemo(() => getReadingTime(content, options), [content, options]);
};

export {
	getReadingTime,
	useReadingTime,
	type ReadingTimeResult,
	type ReadingTimeOptions,
};
