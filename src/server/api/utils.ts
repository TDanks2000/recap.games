import { TRPCError } from "@trpc/server";
import { RateLimiter, Ratelimit } from "../utils/rate-limiter";

export const rateLimit = {
	low: new RateLimiter({
		limiter: Ratelimit.slidingWindow(15, "10s"), // 15 requests per 10s
		prefix: "ratelimit:low",
	}),
	medium: new RateLimiter({
		limiter: Ratelimit.tokenBucket(35, "10s"), // 35 tokens per 10s
		prefix: "ratelimit:medium",
	}),
	high: new RateLimiter({
		limiter: Ratelimit.fixedWindow(65, "10s"), // 65 requests per 10s
		prefix: "ratelimit:high",
	}),
};

/**
 * Normalised TRPCError with optional `retryAfterSeconds` attached so
 * transport layers can set a `Retry-After` header if needed.
 */
type RateLimitError = TRPCError & { retryAfterSeconds?: number };

/**
 * Create a rate-limit TRPCError.
 * - `retryAfter` may be a number (seconds) or a Date.
 * - Returns an error; call `throwRateLimit(...)` to throw it.
 */
export const createRateLimitError = (
	retryAfter?: number | Date,
): RateLimitError => {
	const now = Date.now();

	let retryAfterSeconds: number | undefined;
	if (retryAfter instanceof Date) {
		retryAfterSeconds = Math.max(
			0,
			Math.ceil((retryAfter.getTime() - now) / 1000),
		);
	}

	if (typeof retryAfter === "number" && Number.isFinite(retryAfter)) {
		retryAfterSeconds = Math.max(0, Math.ceil(retryAfter));
	}

	const message = retryAfterSeconds
		? `Rate limit exceeded - try again in ${retryAfterSeconds} second${retryAfterSeconds === 1 ? "" : "s"}.`
		: "Rate limit exceeded.";

	const err = new TRPCError({
		code: "TOO_MANY_REQUESTS",
		message,
		cause: retryAfterSeconds ? { retryAfterSeconds } : undefined,
	}) as RateLimitError;

	if (typeof retryAfterSeconds === "number") {
		err.retryAfterSeconds = retryAfterSeconds;
	}

	return err;
};

export const throwRateLimit = (retryAfter?: number | Date): never => {
	throw createRateLimitError(retryAfter);
};
