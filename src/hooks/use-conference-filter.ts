"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useTransition } from "react";

export function useConferenceFilter() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	// Track the latest state locally to avoid stale URL params
	const latestStateRef = useRef<number[] | null>(null);
	const isFirstRenderRef = useRef(true);

	const urlConferences = useMemo(() => {
		const raw = searchParams.get("conferences") ?? "";
		return raw
			.split(",")
			.map((s) => Number(s))
			.filter((n) => !Number.isNaN(n) && n > 0);
	}, [searchParams]);

	// Initialize from URL on first render only
	useEffect(() => {
		if (isFirstRenderRef.current) {
			latestStateRef.current = urlConferences;
			isFirstRenderRef.current = false;
		}
	}, [urlConferences]);

	// Always prefer local state over URL state
	const selectedConferences = latestStateRef.current ?? urlConferences;

	const onConferenceChange = useCallback(
		(ids: number[]) => {
			// Update local state immediately
			latestStateRef.current = ids;

			// Then update URL in a transition
			startTransition(() => {
				const params = new URLSearchParams(searchParams.toString());
				if (ids.length > 0) {
					params.set("conferences", ids.join(","));
				} else {
					params.delete("conferences");
				}
				router.replace(`${pathname}?${params.toString()}`, { scroll: false });
			});
		},
		[searchParams, router, pathname],
	);

	return { selectedConferences, onConferenceChange, isPending };
}
