"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
	onInsertText: (syntax: string, placeholder?: string) => void;
	className?: string;
}

const toolbarActions = [
	{ label: "Bold", icon: "B", syntax: "**%s**", placeholder: "bold" },
	{ label: "Italic", icon: "I", syntax: "*%s*", placeholder: "italic" },
	{ label: "Heading", icon: "H", syntax: "# %s", placeholder: "Heading" },
	{ label: "List Item", icon: "•", syntax: "- %s", placeholder: "List item" },
];

export function EditorToolbar({ onInsertText, className }: EditorToolbarProps) {
	return (
		<div className={cn("flex space-x-2", className)}>
			{toolbarActions.map((action) => (
				<Button
					key={action.label}
					variant="outline"
					size="sm"
					onClick={() => onInsertText(action.syntax, action.placeholder)}
					title={action.label}
				>
					{action.icon}
				</Button>
			))}
		</div>
	);
}
