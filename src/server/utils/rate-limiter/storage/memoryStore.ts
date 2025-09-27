import type { StoreRecord } from "@/server/@types";

export const globalInMemoryStore: Map<string, StoreRecord> = new Map();

// Cleanup expired entries periodically
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export const cleanupExpiredEntries = (): void => {
	const now = Date.now();
	for (const [key, record] of globalInMemoryStore.entries()) {
		if (now - record.touchedAt > MAX_AGE_MS) {
			globalInMemoryStore.delete(key);
		}
	}
};

// Start cleanup interval
if (typeof setInterval !== "undefined") {
	setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL_MS);
}
