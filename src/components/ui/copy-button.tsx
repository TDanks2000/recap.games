"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
	content: string;
	copyMessage?: string;
};

export function CopyButton({ content, copyMessage }: CopyButtonProps) {
	const { isCopied, handleCopy } = useCopyToClipboard({
		text: content,
		copyMessage,
	});

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="group relative h-8 w-8 overflow-hidden transition-all duration-300 hover:scale-110 hover:bg-primary/10"
					aria-label="Copy link to clipboard"
					onClick={handleCopy}
				>
					{/* Success state */}
					<div
						className={cn(
							"absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out",
							isCopied ? "scale-100 opacity-100" : "scale-75 opacity-0",
						)}
					>
						<Check className="h-4 w-4 text-green-500" />
					</div>

					{/* Default state */}
					<Copy
						className={cn(
							"h-4 w-4 transition-all duration-300 ease-out group-hover:text-primary",
							isCopied ? "scale-75 opacity-0" : "scale-100 opacity-100",
						)}
					/>

					{/* Gaming glow effect */}
					<div
						className={cn(
							"absolute inset-0 rounded-md bg-gradient-to-r transition-opacity duration-300",
							isCopied
								? "from-green-500/20 to-green-400/20 opacity-100"
								: "from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100",
						)}
					/>
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom">
				<p>{isCopied ? "Link copied!" : "Copy link"}</p>
			</TooltipContent>
		</Tooltip>
	);
}
