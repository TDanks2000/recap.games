"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { HomeSearchParams } from "@/@types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToggleButtonProps = {
	searchParams: HomeSearchParams;
};

export function ToggleButton({ searchParams }: ToggleButtonProps) {
	const pathname = usePathname();
	const currentParams = useSearchParams();

	const open = searchParams?.conferenceOpen === "true";

	// Build next search params
	const nextParams = new URLSearchParams(currentParams.toString());
	nextParams.set("conferenceOpen", (!open).toString());

	// Preserve other params from HomeSearchParams
	Object.entries(searchParams).forEach(([key, value]) => {
		if (key !== "conferenceOpen" && value !== undefined && value !== null) {
			nextParams.set(key, String(value));
		}
	});

	const href = `${pathname}?${nextParams.toString()}`;

	return (
		<Link href={href} scroll={false}>
			<Button
				variant={open ? "default" : "outline"}
				aria-pressed={open}
				className={cn(
					"transition-all duration-200",
					open ? "bg-primary text-primary-foreground" : "",
				)}
			>
				{open ? "Hide Panel" : "Show Panel"}
			</Button>
		</Link>
	);
}
