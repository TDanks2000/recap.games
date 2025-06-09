"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyButton } from "../ui/copy-button";
import { shareButtonItems } from "./items";
import { ShareLink } from "./shareLink";

export type ShareButtonProps = {
	url?: string;
	title?: string;
	className?: string;
};

export const ShareButton = ({
	url,
	title = "",
	className,
}: ShareButtonProps) => {
	const [open, setOpen] = useState(false);

	const resolvedUrl =
		url ?? (typeof window !== "undefined" ? window.location.href : "");
	const encodedUrl = encodeURIComponent(resolvedUrl);
	const encodedTitle = encodeURIComponent(title);

	const links = shareButtonItems(encodedUrl, encodedTitle);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<Tooltip>
				<TooltipTrigger asChild>
					<PopoverTrigger asChild>
						<Button
							onClick={() => setOpen(true)}
							variant="ghost"
							size="icon"
							className={`group relative overflow-hidden transition-all duration-300 hover:scale-110 hover:border-primary/30 hover:bg-primary/10 ${className}`}
						>
							<Share2 className="h-4 w-4 transition-colors group-hover:text-primary" />

							{/* Gaming glow effect */}
							<div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
						</Button>
					</PopoverTrigger>
				</TooltipTrigger>
				<TooltipContent side="bottom">
					<p>Share this post</p>
				</TooltipContent>
			</Tooltip>

			<PopoverContent
				className="w-[300px] border-border/50 bg-card/95 p-4 shadow-2xl shadow-primary/10 backdrop-blur-sm"
				side="bottom"
				align="start"
			>
				{/* Header with enhanced styling */}
				<div className="mb-4 flex items-center justify-between">
					<div className="space-y-1">
						<span className="font-semibold text-base text-foreground">
							Share this post
						</span>
						<p className="text-muted-foreground text-xs">
							Spread the gaming word
						</p>
					</div>

					<div className="rounded-lg bg-background/50 p-1">
						<CopyButton content={resolvedUrl} />
					</div>
				</div>

				{/* Enhanced grid with better spacing */}
				<div className="grid grid-cols-5 gap-3">
					{links.map((link) => (
						<ShareLink key={link.href} {...link} />
					))}
				</div>

				{/* Gaming accent line */}
				<div className="mt-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
			</PopoverContent>
		</Popover>
	);
};
