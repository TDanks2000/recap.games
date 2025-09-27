import { parseDuration } from "./utils/duration";

export const Ratelimit = {
	slidingWindow: (limit: number, duration: string) => {
		const windowMs = parseDuration(duration);
		return { type: "sliding-window" as const, limit, windowMs };
	},
	tokenBucket: (limit: number, duration: string) => {
		const windowMs = parseDuration(duration);
		return { type: "token-bucket" as const, limit, windowMs };
	},
	fixedWindow: (limit: number, duration: string) => {
		const windowMs = parseDuration(duration);
		return { type: "fixed-window" as const, limit, windowMs };
	},
};

export { RateLimiter } from "./RateLimiter";
