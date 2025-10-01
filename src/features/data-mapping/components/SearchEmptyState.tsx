import type { LucideIcon } from "lucide-react";

interface SearchEmptyStateProps {
	icon: LucideIcon;
	title: string;
	subtitle?: string;
	iconClassName?: string;
}

export function SearchEmptyState({
	icon: Icon,
	title,
	subtitle,
	iconClassName = "",
}: SearchEmptyStateProps) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-2 text-gray-400">
			<Icon className={`h-8 w-8 ${iconClassName}`} />
			<p className="text-sm">{title}</p>
			{subtitle && <p className="text-xs">{subtitle}</p>}
		</div>
	);
}
