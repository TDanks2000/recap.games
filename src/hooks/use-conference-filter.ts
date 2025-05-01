"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useConferenceFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedConferences = useMemo(() => {
    const raw = searchParams.get("conferences") ?? "";
    return raw
      .split(",")
      .map((s) => Number(s))
      .filter((n) => !isNaN(n) && n > 0);
  }, [searchParams]);

  const onConferenceChange = useCallback(
    (ids: number[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (ids.length > 0) {
        params.set("conferences", ids.join(","));
      } else {
        params.delete("conferences");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return { selectedConferences, onConferenceChange };
}
