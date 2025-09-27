import type { FixedWindowRecord, RateLimitResult } from "@/server/@types";

const nowMsFW = (): number => Date.now();

export const createFixedWindowRecord = (points = 0): FixedWindowRecord => {
	const t = nowMsFW();
	return {
		count: points,
		windowStart: t,
		touchedAt: t,
	};
};

export const consumeFixedWindow = (
	rec: FixedWindowRecord,
	opts: { limit: number; windowMs: number },
	points: number,
): RateLimitResult => {
	const now = nowMsFW();
	const { limit, windowMs } = opts;

	if (rec.windowStart + windowMs <= now) {
		rec.count = points;
		rec.windowStart = now;
		rec.touchedAt = now;

		const remaining = Math.max(0, limit - rec.count);
		const resetAfter = rec.windowStart + windowMs - now;

		return {
			success: rec.count <= limit,
			limit,
			remaining,
			reset: rec.windowStart + windowMs,
			resetAfter: Math.max(0, resetAfter),
			consumedPoints: Math.min(points, limit),
		};
	}

	rec.count += points;
	rec.touchedAt = now;

	const remaining = Math.max(0, limit - rec.count);
	const resetAfter = rec.windowStart + windowMs - now;

	return {
		success: rec.count <= limit,
		limit,
		remaining,
		reset: rec.windowStart + windowMs,
		resetAfter: Math.max(0, resetAfter),
		consumedPoints: Math.min(points, limit),
	};
};
