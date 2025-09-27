import type {
	RateLimiterOptions,
	RateLimitResult,
	StoreRecord,
} from "@/server/@types";
import { globalInMemoryStore } from "./storage/memoryStore";
import {
	consumeSlidingWindow,
	createSlidingWindowRecord,
} from "./strategies/slidingWindow";
import {
	consumeTokenBucket,
	createTokenBucketRecord,
} from "./strategies/tokenBucket";

const defaultPrefix = "ratelimit:";

export class RateLimiter {
	private readonly prefix: string;
	private readonly limiterConfig: RateLimiterOptions["limiter"];
	private readonly storage: Map<string, StoreRecord>;

	constructor(opts: RateLimiterOptions) {
		this.prefix = opts.prefix ?? defaultPrefix;
		this.limiterConfig = opts.limiter;
		this.storage = globalInMemoryStore;
	}

	public readonly limit = async (
		id: string,
		points = 1,
	): Promise<RateLimitResult> => {
		// Input validation
		if (points < 0) {
			throw new Error("Points must be non-negative");
		}
		if (this.limiterConfig.limit <= 0) {
			throw new Error("Limit must be positive");
		}

		const key = `${this.prefix}${id}`;
		const now = Date.now();

		if (this.limiterConfig.type === "token-bucket") {
			const cfg = this.limiterConfig;
			const maybe = this.storage.get(key);
			if (!maybe || !("tokens" in maybe)) {
				const rec = createTokenBucketRecord(cfg.limit, cfg.windowMs, points);
				this.storage.set(key, rec);
				const remaining = Math.max(0, Math.floor(rec.tokens));
				const resetAfter = Math.max(0, rec.lastRefill + cfg.windowMs - now);
				return {
					success: remaining >= 0,
					limit: cfg.limit,
					remaining,
					reset: now + resetAfter,
					resetAfter,
					consumedPoints: Math.min(points, cfg.limit),
				};
			}
			const rec = maybe;
			const out = consumeTokenBucket(rec, points);
			return {
				success: out.success,
				limit: cfg.limit,
				remaining: out.remaining,
				reset: now + out.resetAfter,
				resetAfter: out.resetAfter,
				consumedPoints: out.success ? points : 0,
			};
		}

		if (this.limiterConfig.type === "sliding-window") {
			const cfg = this.limiterConfig;
			const maybe = this.storage.get(key);
			if (!maybe || !("timestamps" in maybe)) {
				const rec = createSlidingWindowRecord(points);
				this.storage.set(key, rec);
				const remaining = Math.max(0, cfg.limit - rec.timestamps.length);

				const firstTs = rec.timestamps[0];
				const resetAfter =
					firstTs == null ? 0 : Math.max(0, cfg.windowMs - (now - firstTs));

				return {
					success: rec.timestamps.length <= cfg.limit,
					limit: cfg.limit,
					remaining,
					reset: now + resetAfter,
					resetAfter,
					consumedPoints: Math.min(points, cfg.limit),
				};
			}

			const rec = maybe;
			const out = consumeSlidingWindow(rec, cfg.limit, cfg.windowMs, points);
			return {
				success: out.success,
				limit: cfg.limit,
				remaining: out.remaining,
				reset: now + out.resetAfter,
				resetAfter: out.resetAfter,
				consumedPoints: out.success ? points : 0,
			};
		}

		if (this.limiterConfig.type === "fixed-window") {
			const cfg = this.limiterConfig;
			const maybe = this.storage.get(key);
			if (!maybe || !("windowStart" in maybe)) {
				const rec = { count: points, windowStart: now, touchedAt: now };
				this.storage.set(key, rec);
				const remaining = Math.max(0, cfg.limit - rec.count);
				const resetAfter = rec.windowStart + cfg.windowMs - now;
				return {
					success: rec.count <= cfg.limit,
					limit: cfg.limit,
					remaining,
					reset: rec.windowStart + cfg.windowMs,
					resetAfter: Math.max(0, resetAfter),
					consumedPoints: rec.count <= cfg.limit ? points : 0,
				};
			}
			const rec = maybe;
			if (rec.windowStart + cfg.windowMs <= now) {
				rec.count = points;
				rec.windowStart = now;
				rec.touchedAt = now;
				const remaining = Math.max(0, cfg.limit - rec.count);
				const resetAfter = rec.windowStart + cfg.windowMs - now;
				return {
					success: rec.count <= cfg.limit,
					limit: cfg.limit,
					remaining,
					reset: rec.windowStart + cfg.windowMs,
					resetAfter: Math.max(0, resetAfter),
					consumedPoints: rec.count <= cfg.limit ? points : 0,
				};
			}
			rec.count = rec.count + points;
			rec.touchedAt = now;
			const remaining = Math.max(0, cfg.limit - rec.count);
			const resetAfter = rec.windowStart + cfg.windowMs - now;
			return {
				success: rec.count <= cfg.limit,
				limit: cfg.limit,
				remaining,
				reset: rec.windowStart + cfg.windowMs,
				resetAfter: Math.max(0, resetAfter),
				consumedPoints: rec.count <= cfg.limit ? points : 0,
			};
		}

		throw new Error("unsupported limiter type");
	};

	public readonly getRaw = (id: string): StoreRecord | undefined => {
		return this.storage.get(`${this.prefix}${id}`);
	};

	public readonly reset = (id: string): void => {
		this.storage.delete(`${this.prefix}${id}`);
	};

	public readonly clearAll = (): void => {
		for (const k of Array.from(this.storage.keys())) {
			if (k.startsWith(this.prefix)) this.storage.delete(k);
		}
	};
}
