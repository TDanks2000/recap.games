"use client";

import { ArrowUp } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
	children: ReactNode;
}

export function BlogLayout({ children }: LayoutProps) {
	const [showScrollTop, setShowScrollTop] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setShowScrollTop(window.scrollY > 400);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<main className="relative min-h-screen w-full">
			{/* Content wrapper */}
			<div className="relative z-10">{children}</div>

			{/* Gaming-styled scroll to top button */}
			<Button
				onClick={scrollToTop}
				size="icon"
				className={cn(
					"fixed right-8 bottom-8 z-50 h-12 w-12 rounded-xl bg-primary/90 shadow-lg shadow-primary/25 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-primary",
					showScrollTop
						? "translate-y-0 opacity-100"
						: "translate-y-16 opacity-0",
				)}
			>
				<ArrowUp className="size-6" />
			</Button>
		</main>
	);
}
