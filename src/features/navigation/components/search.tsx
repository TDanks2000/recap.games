"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const NavBarSearch = () => {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const inputRef = useRef<HTMLInputElement>(null);
	const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Initialize value from search params
	useEffect(() => {
		setValue(searchParams.get("search") ?? "");
	}, [searchParams]);

	// Handle escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && open) {
				setOpen(false);
				inputRef.current?.blur();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [open]);

	// Handle click outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				open &&
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open]);

	const toggleOpen = useCallback(() => {
		setOpen((prev) => {
			const newOpen = !prev;
			if (newOpen) {
				setTimeout(() => inputRef.current?.focus(), 50);
			}
			return newOpen;
		});
	}, []);

	const closeSearch = useCallback(() => {
		setOpen(false);
		inputRef.current?.blur();
	}, []);

	const clearSearch = useCallback(() => {
		setValue("");
		if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
		const params = new URLSearchParams(searchParams.toString());
		params.delete("page");
		params.delete("search");
		router.push(`${pathname}?${params.toString()}`);
		inputRef.current?.focus();
	}, [pathname, router, searchParams]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setValue(newValue);

			if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

			if (!newValue?.length) {
				const params = new URLSearchParams(searchParams.toString());
				params.delete("page");
				params.delete("search");
				router.push(`${pathname}?${params.toString()}`);
				return;
			}

			if (newValue === searchParams.get("search")) return;

			debounceTimeout.current = setTimeout(() => {
				const params = new URLSearchParams(searchParams.toString());
				params.delete("page");
				params.set("search", newValue);
				router.push(`${pathname}?${params.toString()}`);
			}, 300);
		},
		[pathname, router, searchParams],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				e.preventDefault();
				if (debounceTimeout.current) {
					clearTimeout(debounceTimeout.current);
					const params = new URLSearchParams(searchParams.toString());
					if (value) {
						params.set("search", value);
					} else {
						params.delete("search");
					}
					params.delete("page");
					router.push(`${pathname}?${params.toString()}`);
				}
			}
		},
		[pathname, router, searchParams, value],
	);

	return (
		<div className="flex flex-1 items-center justify-end sm:justify-start">
			<div
				ref={containerRef}
				className="search-container relative flex items-center"
			>
				{/* Search Input */}
				<Suspense fallback={null}>
					<div
						className={cn(
							"relative overflow-hidden transition-all duration-300 ease-out",
							open
								? "w-44 opacity-100 sm:w-72 md:w-80"
								: "pointer-events-none w-0 opacity-0",
						)}
					>
						<Input
							ref={inputRef}
							value={value}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							type="text"
							placeholder="Search games or conferences..."
							aria-label="Search games or conferences"
							className={cn(
								"w-full py-2.5 pr-8 pl-4 text-sm",
								"border-border/50 bg-background/95 backdrop-blur-sm",
								"focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
								"transition-all duration-200",
								"placeholder:text-muted-foreground/70",
							)}
						/>
						{/* Clear button */}
						{value && (
							<Button
								variant="ghost"
								size="sm"
								onClick={clearSearch}
								aria-label="Clear search"
								className={cn(
									"-translate-y-1/2 absolute top-1/2 right-1",
									"h-6 w-6 p-0 hover:bg-muted/80",
									"text-muted-foreground hover:text-foreground",
									"transition-colors duration-200",
								)}
							>
								<X className="h-3.5 w-3.5" />
							</Button>
						)}
					</div>
				</Suspense>

				{/* Search Button */}
				<Button
					variant={open ? "default" : "secondary"}
					size="icon"
					onClick={open ? closeSearch : toggleOpen}
					aria-label={open ? "Close search" : "Open search"}
					className={cn(
						"relative z-10 ml-2 flex-shrink-0",
						"transition-all duration-200 ease-out",
						"hover:scale-105 active:scale-95",
						open && "shadow-md",
					)}
				>
					<Search
						className={cn(
							"h-4 w-4 transition-transform duration-200",
							open && "scale-110",
						)}
					/>
				</Button>
			</div>
		</div>
	);
};

export default NavBarSearch;
