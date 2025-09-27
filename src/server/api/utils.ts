import { TRPCError } from "@trpc/server";
import { RateLimiter, Ratelimit } from "../utils/rate-limiter";

export const rateLimit = {
	low: new RateLimiter({
		limiter: Ratelimit.slidingWindow(10, "10s"), // 10 requests per 10s
		prefix: "ratelimit:low",
	}),
	medium: new RateLimiter({
		limiter: Ratelimit.tokenBucket(30, "10s"), // 30 tokens per 10s
		prefix: "ratelimit:medium",
	}),
	high: new RateLimiter({
		limiter: Ratelimit.fixedWindow(60, "10s"), // 60 requests per 10s
		prefix: "ratelimit:high",
	}),
};

export const RateLimitResponse = (retryAfter?: number) => {
	throw new TRPCError({
		code: "TOO_MANY_REQUESTS",
		message: `You have been rate limited${retryAfter ? `, try again in ${retryAfter}` : ""}`,
	});
};
