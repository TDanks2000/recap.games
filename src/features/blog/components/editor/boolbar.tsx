"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarAction {
	label: string;
	icon: string;
	action: (content: string) => string;
}

interface ToolbarProps {
	content: string;
	onContentChange: (content: string) => void;
	className?: string;
}

const toolbarActions: ToolbarAction[] = [
	{
		label: "Bold",
		icon: "B",
		action: (content) => `${content}**Bold**`,
	},
	{
		label: "Italic",
		icon: "I",
		action: (content) => `${content}*Italic*`,
	},
	{
		label: "Heading",
		icon: "H",
		action: (content) => `${content}\n# Heading`,
	},
	{
		label: "Link",
		icon: "🔗",
		action: (content) => `${content}[Link Text](url)`,
	},
	{
		label: "Code",
		icon: "</>",
		action: (content) => `${content}\n\`\`\`\ncode\n\`\`\``,
	},
	{
		label: "Quote",
		icon: '"',
		action: (content) => `${content}\n> Quote`,
	},
];

export function Toolbar({ content, onContentChange, className }: ToolbarProps) {
	return (
		<div className={cn("flex flex-wrap gap-2", className)}>
			{toolbarActions.map((action) => (
				<Button
					key={action.label}
					variant="outline"
					size="sm"
					onClick={() => onContentChange(action.action(content))}
					title={action.label}
				>
					{action.icon}
				</Button>
			))}
		</div>
	);
}
