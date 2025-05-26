"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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
			<PopoverTrigger asChild>
				<Button
					onClick={() => setOpen(true)}
					variant="ghost"
					size="icon"
					className={className}
				>
					<Share2 />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-[280px] p-3 sm:w-[320px] sm:p-4">
				<div className="mb-3 flex items-center justify-between sm:mb-4">
					<span className="font-semibold text-sm sm:text-base">Share this</span>

					<CopyButton content={resolvedUrl} />
				</div>
				<div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
					{links.map((link) => (
						<ShareLink key={link.href} {...link} />
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
};
