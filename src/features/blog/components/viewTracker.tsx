"use client";

import { useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { api } from "@/trpc/react";

interface ViewTrackerProps {
	postId: number;
}

/**
 * Client-side component that records a view when a blog post is visited
 * Uses debouncing to prevent multiple counts during a single visit
 */
export function ViewTracker({ postId }: ViewTrackerProps) {
	const [hasRecorded, setHasRecorded] = useState(false);

	// Get or create a session ID for anonymous users
	const getSessionId = useCallback(() => {
		// Check if we already have a session ID in localStorage
		let sessionId = localStorage.getItem("session_id");

		// If not, create a new one
		if (!sessionId) {
			// Generate a simple random ID with timestamp for uniqueness
			sessionId = uuid();
			localStorage.setItem("session_id", sessionId);
		}

		return sessionId;
	}, []);

	const recordView = api.blog.recordView.useMutation();

	useEffect(() => {
		// Only run on client-side
		if (typeof window === "undefined") return;

		// Only record the view once per component mount
		if (!hasRecorded && postId) {
			const sessionId = getSessionId();
			const referrer = document.referrer || undefined;

			// Record the view
			recordView.mutate({
				postId,
				sessionId,
				referrer,
			});

			setHasRecorded(true);
		}

		// Start tracking read time
		const startTime = Date.now();

		return () => {
			// When component unmounts, calculate read time
			if (hasRecorded) {
				const readTime = Math.floor((Date.now() - startTime) / 1000); // in seconds

				// Only record read time if it's reasonable (more than 5 seconds)
				if (readTime > 5) {
					const sessionId = getSessionId();

					recordView.mutate({
						postId,
						sessionId,
						readTime,
					});
				}
			}
		};
	}, [getSessionId, hasRecorded, postId, recordView]);

	// This component doesn't render anything
	return null;
}
