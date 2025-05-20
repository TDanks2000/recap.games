"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { api, type RouterInputs } from "@/trpc/react";

type RecordViewPayload = RouterInputs["blog"]["recordView"];

interface ViewTrackerProps {
	postId: number;
}

export function ViewTracker({ postId }: ViewTrackerProps) {
	const [hasRecordedInitialView, setHasRecordedInitialView] = useState(false);
	const startTimeRef = useRef<number | null>(null);
	const hasSentReadTimeRef = useRef(false); // Prevents sending read time multiple times

	const getSessionId = useCallback((): string => {
		if (typeof window === "undefined") {
			return "ssr-placeholder-session-id";
		}
		let sessionId = localStorage.getItem("session_id");
		if (!sessionId) {
			sessionId = uuid();
			localStorage.setItem("session_id", sessionId);
		}
		return sessionId;
	}, []);

	const recordViewMutation = api.blog.recordView.useMutation();

	const sendReadTimeData = useCallback(() => {
		if (
			!startTimeRef.current ||
			hasSentReadTimeRef.current ||
			typeof window === "undefined"
		) {
			return;
		}

		const readTime = Math.floor((Date.now() - startTimeRef.current) / 1000);

		if (readTime > 5) {
			const sessionId = getSessionId();
			const payload: RecordViewPayload = {
				postId,
				sessionId,
				readTime,
			};
			recordViewMutation.mutate(payload);
			hasSentReadTimeRef.current = true; // Mark as sent
		}
	}, [postId, getSessionId, recordViewMutation]);

	useEffect(() => {
		if (typeof window === "undefined" || !postId) {
			return;
		}

		if (!hasRecordedInitialView) {
			const sessionId = getSessionId();
			const referrer = document.referrer || undefined;
			const payload: RecordViewPayload = {
				postId,
				sessionId,
				referrer,
			};
			recordViewMutation.mutate(payload);
			setHasRecordedInitialView(true);
			startTimeRef.current = Date.now();
			hasSentReadTimeRef.current = false; // Reset for new tracking session
		}

		const handleVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				sendReadTimeData();
			}
		};

		const handlePageHide = () => {
			sendReadTimeData();
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("pagehide", handlePageHide);

		return () => {
			sendReadTimeData(); // Attempt to send on unmount
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("pagehide", handlePageHide);
		};
	}, [
		postId,
		hasRecordedInitialView,
		getSessionId,
		recordViewMutation,
		sendReadTimeData,
	]);

	return null;
}
