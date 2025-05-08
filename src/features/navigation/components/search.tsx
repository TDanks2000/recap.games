"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const NavBarSearch = () => {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const inputRef = useRef<HTMLInputElement>(null);
	const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

	const toggleOpen = () => {
		setOpen((prev) => {
			if (!prev) inputRef.current?.focus();
			return !prev;
		});
	};

	const handleBlur = () => {
		setTimeout(() => {
			if (!document.activeElement?.closest(".search-container")) {
				setOpen(false);
			}
		}, 150);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (!value?.length) {
			if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
			const params = new URLSearchParams(searchParams.toString());
			params.delete("search");
			router.push(`${pathname}?${params.toString()}`);
			return;
		}
		if (value === searchParams.get("search")) return;
		if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
		debounceTimeout.current = setTimeout(() => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("search", value);
			router.push(`${pathname}?${params.toString()}`);
		}, 300);
	};

	return (
		<div className="flex flex-1 items-center justify-end sm:justify-start">
			<div className="search-container relative flex items-center gap-2">
				{/* Search Button (Fixed on Right) */}
				<Button
					variant="secondary"
					size="icon"
					onClick={toggleOpen}
					aria-label={open ? "Close search input" : "Open search input"}
					className="relative z-10 flex-shrink-0"
				>
					<Search />
				</Button>

				{/* Search Input (Expands to the left) */}
				<Suspense fallback={null}>
					<Input
						ref={inputRef}
						defaultValue={searchParams.get("search") ?? ""}
						onChange={handleChange}
						type="text"
						placeholder="Search Games or Conferences"
						aria-label="Search Games or Conferences"
						onBlur={handleBlur}
						onFocus={() => setOpen(true)}
						className={cn(
							"absolute right-0 rounded-md border border-border py-2 pr-[3.25rem] pl-4 transition-all duration-300 ease-in-out",
							open ? "w-72 opacity-100" : "pointer-events-none w-0 opacity-0",
						)}
					/>
				</Suspense>
			</div>
		</div>
	);
};

export default NavBarSearch;
