"use client";

import { Menu } from "lucide-react";
import Link from "next/link"; // Import Link from next/link
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import LogoLink from "./links/logo";
import NavBarSearch from "./search";
import YearFilter from "./year-filter";

const NavigationBar = () => {
	const pathname = usePathname().toLowerCase();

	if (pathname.startsWith("/admin")) return null;

	const navLinks = [
		{ href: "/blog", label: "Blog" },
		{ href: "/about", label: "About" },
	];

	return (
		<header className="relative flex h-16 items-center gap-4 overflow-hidden border-b bg-muted/40 px-4 md:px-6">
			<nav className="hidden flex-col gap-6 font-medium text-lg md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
				<LogoLink />
				<div className="flex gap-4 lg:gap-6">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={cn("transform-all hover:text-primary", {
								"text-primary": pathname === link.href.toLowerCase(),
							})}
						>
							{link.label}
						</Link>
					))}
				</div>
			</nav>

			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant="secondary"
						size="icon"
						className="shrink-0 md:hidden"
					>
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="p-4">
					<nav className="grid gap-6 font-medium text-lg">
						<LogoLink />
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={cn("transition-all hover:text-primary", {
									"text-primary": pathname === link.href.toLowerCase(),
								})}
							>
								{link.label}
							</Link>
						))}
					</nav>
				</SheetContent>
			</Sheet>

			<div className="relative flex w-full items-center justify-end gap-3 overflow-hidden md:ml-auto md:gap-3 lg:gap-4">
				<div className="shrink">
					<Suspense fallback={null}>
						<NavBarSearch />
					</Suspense>
				</div>

				<ModeToggle />

				<YearFilter />
			</div>
		</header>
	);
};

export default NavigationBar;
