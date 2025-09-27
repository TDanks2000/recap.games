export type RateLimitStrategyType =
	| "token-bucket"
	| "fixed-window"
	| "sliding-window";

export interface RateLimiterOptions {
	prefix?: string;
	limiter: LimiterConfig;
}

export type LimiterConfig =
	| { type: "token-bucket"; limit: number; windowMs: number }
	| { type: "fixed-window"; limit: number; windowMs: number }
	| { type: "sliding-window"; limit: number; windowMs: number };

export interface RateLimitResult {
	success: boolean;
	limit: number;
	remaining: number;
	reset: number;
	resetAfter: number;
	consumedPoints: number;
}

export type TokenBucketRecord = {
	tokens: number;
	lastRefill: number;
	capacity: number;
	refillRatePerMs: number;
	touchedAt: number;
};

export type FixedWindowRecord = {
	count: number;
	windowStart: number;
	touchedAt: number;
};

export type SlidingWindowRecord = {
	timestamps: Array<number>;
	touchedAt: number;
};

export type StoreRecord =
	| TokenBucketRecord
	| FixedWindowRecord
	| SlidingWindowRecord;
