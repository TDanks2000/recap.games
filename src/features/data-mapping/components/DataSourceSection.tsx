import { ChevronDown, Database } from "lucide-react";
import type { ReactNode } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

type SourceColor = "blue" | "purple" | "green" | "orange" | "red";

interface DataSourceSectionProps {
	sourceName: string;
	sourceColor?: SourceColor;
	resultCount: number;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	children: ReactNode;
}

const colorClasses: Record<SourceColor, { bg: string; text: string }> = {
	blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
	purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
	green: { bg: "bg-green-500/10", text: "text-green-400" },
	orange: { bg: "bg-orange-500/10", text: "text-orange-400" },
	red: { bg: "bg-red-500/10", text: "text-red-400" },
};

export function DataSourceSection({
	sourceName,
	sourceColor = "blue",
	resultCount,
	isOpen,
	onOpenChange,
	children,
}: DataSourceSectionProps) {
	const colors = colorClasses[sourceColor];

	return (
		<Collapsible open={isOpen} onOpenChange={onOpenChange}>
			<div className="rounded-lg border border-gray-800 bg-gray-900/50">
				<CollapsibleTrigger className="flex w-full items-center justify-between p-4 transition-colors hover:bg-gray-800/50">
					<div className="flex items-center gap-3">
						<div className={`rounded-md ${colors.bg} p-2`}>
							<Database className={`h-4 w-4 ${colors.text}`} />
						</div>
						<div className="text-left">
							<h3 className="font-semibold text-white">{sourceName}</h3>
							<p className="text-gray-400 text-xs">
								{resultCount} {resultCount === 1 ? "result" : "results"} found
							</p>
						</div>
					</div>
					<ChevronDown
						className={`h-5 w-5 text-gray-400 transition-transform ${
							isOpen ? "rotate-180" : ""
						}`}
					/>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="space-y-2 border-gray-800 border-t p-3">
						{children}
					</div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
}
