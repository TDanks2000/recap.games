import type { SlidingWindowRecord } from "@/server/@types";

export const createSlidingWindowRecord = (points = 0): SlidingWindowRecord => {
	const t = Date.now();
	const timestamps: number[] = Array(points).fill(t);
	return { timestamps, touchedAt: t };
};

export const consumeSlidingWindow = (
	rec: SlidingWindowRecord,
	limit: number,
	windowMs: number,
	points: number,
): { success: boolean; remaining: number; resetAfter: number } => {
	const now = Date.now();
	const cutoff = now - windowMs;

	while (rec.timestamps.length > 0) {
		const first = rec.timestamps[0];
		if (first == null || first > cutoff) break;
		rec.timestamps.shift();
	}

	const canConsume = rec.timestamps.length + points <= limit;

	if (canConsume) {
		const nowArray = Array(points).fill(now);
		rec.timestamps.push(...nowArray);
	}

	rec.touchedAt = now;

	const remaining = Math.max(0, limit - rec.timestamps.length);

	const firstTs = rec.timestamps[0];
	const resetAfter =
		firstTs == null ? 0 : Math.max(0, windowMs - (now - firstTs));

	return { success: canConsume, remaining, resetAfter };
};
