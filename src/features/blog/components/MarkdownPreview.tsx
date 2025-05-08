"use client";

import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps {
	content: string;
	className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
	return (
		<div
			className={cn(
				"prose dark:prose-invert max-w-none rounded-md border p-4",
				className,
			)}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeSanitize]}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
