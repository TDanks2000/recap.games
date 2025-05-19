import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DisplayPanelProps = {
	open: boolean;
	children: React.ReactNode;
};

export function DisplayPanel({ open, children }: DisplayPanelProps) {
	return (
		<Card
			aria-hidden={!open}
			tabIndex={open ? 0 : -1}
			className={cn(
				"pointer-events-auto h-full w-full transform-gpu transition-all duration-300 ease-in-out",
				"mx-auto max-w-md shadow-lg",
				open
					? "pointer-events-auto scale-100 opacity-100"
					: "pointer-events-none size-0 scale-95 opacity-0",
			)}
			style={{ willChange: "opacity, transform" }}
		>
			{children}
		</Card>
	);
}
