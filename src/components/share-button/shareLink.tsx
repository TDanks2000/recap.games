import type { IconType } from "react-icons/lib";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";

export type ShareLinkProps = {
	Icon: IconType;
	title: string;
	href: string;
};

export const ShareLink = (props: ShareLinkProps) => {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					asChild
					className="group relative size-12 overflow-hidden border-border/50 bg-background/50 transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/20"
				>
					<a
						href={props.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Share on ${props.title}`}
					>
						<props.Icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />

						{/* Gaming glow effect on hover */}
						<div className="absolute inset-0 rounded-md bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
					</a>
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom">
				<p>Share on {props.title}</p>
			</TooltipContent>
		</Tooltip>
	);
};
