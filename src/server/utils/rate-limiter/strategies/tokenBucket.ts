import type { TokenBucketRecord } from "@/server/@types";

const nowMs = (): number => Date.now();

export const createTokenBucketRecord = (
	limit: number,
	windowMs: number,
	points = 0,
): TokenBucketRecord => {
	const capacity = limit;
	const refillRatePerMs = capacity / windowMs;
	const t = nowMs();
	const initialTokens = Math.max(0, capacity - points);
	return {
		tokens: initialTokens,
		lastRefill: t,
		capacity,
		refillRatePerMs,
		touchedAt: t,
	};
};

export const refillTokenBucket = (rec: TokenBucketRecord): void => {
	const now = nowMs();
	const elapsed = now - rec.lastRefill;
	if (elapsed <= 0) return;
	const added = elapsed * rec.refillRatePerMs;
	rec.tokens = Math.min(rec.capacity, rec.tokens + added);
	rec.lastRefill = now;
};

export const consumeTokenBucket = (
	rec: TokenBucketRecord,
	points: number,
): { success: boolean; remaining: number; resetAfter: number } => {
	refillTokenBucket(rec);
	rec.touchedAt = Date.now();
	if (rec.tokens + 1e-9 >= points) {
		rec.tokens = rec.tokens - points;
		const remaining = Math.max(0, Math.floor(rec.tokens));
		const needed = Math.max(0, points - rec.tokens);
		const resetAfter =
			needed <= 0 ? 0 : Math.ceil(needed / rec.refillRatePerMs);
		return { success: true, remaining, resetAfter };
	}
	const remaining = Math.max(0, Math.floor(rec.tokens));
	const needed = Math.max(0, points - rec.tokens);
	const resetAfter = Math.ceil(needed / rec.refillRatePerMs);
	return { success: false, remaining, resetAfter };
};
