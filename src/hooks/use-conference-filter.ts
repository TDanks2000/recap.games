"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useTransition } from "react";

export function useConferenceFilter() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	// Track the latest state locally to avoid stale URL params
	const latestStateRef = useRef<number[]>([]);

	const selectedConferences = useMemo(() => {
		const raw = searchParams.get("conferences") ?? "";
		const fromUrl = raw
			.split(",")
			.map((s) => Number(s))
			.filter((n) => !Number.isNaN(n) && n > 0);

		// Initialize ref if empty
		if (latestStateRef.current.length === 0) {
			latestStateRef.current = fromUrl;
		}

		return latestStateRef.current;
	}, [searchParams]);

	const onConferenceChange = useCallback(
		(ids: number[]) => {
			latestStateRef.current = ids;

			// Then update URL
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
