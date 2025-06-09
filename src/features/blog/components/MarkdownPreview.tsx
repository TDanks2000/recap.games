"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps {
	content: string;
	className?: string;
}

function CodeBlock({
	children,
	className,
}: {
	children: string;
	className?: string;
}) {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(children);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="group relative">
			<pre
				className={cn(
					"overflow-x-auto rounded-lg border border-border/50 bg-muted/50 p-4",
					"before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-primary/5 before:to-accent/5 before:opacity-0 before:transition-opacity hover:before:opacity-100",
					className,
				)}
			>
				<code className="font-mono text-sm">{children}</code>
			</pre>
			<Button
				size="icon"
				variant="ghost"
				onClick={copyToClipboard}
				className="absolute top-2 right-2 h-8 w-8 bg-background/80 opacity-0 transition-opacity hover:bg-background/90 group-hover:opacity-100"
			>
				{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
			</Button>
		</div>
	);
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
	return (
		<div
			className={cn(
				// Gaming-themed prose styling
				"prose prose-lg dark:prose-invert max-w-none",
				// Enhanced colors for gaming theme
				"prose-headings:font-bold prose-headings:text-foreground",
				"prose-h1:mb-6 prose-h1:border-primary/20 prose-h1:border-b prose-h1:pb-3 prose-h1:text-3xl",
				"prose-h2:mb-4 prose-h2:text-2xl prose-h2:text-primary",
				"prose-h3:mb-3 prose-h3:text-primary/80 prose-h3:text-xl",
				"prose-p:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed",
				"prose-strong:font-semibold prose-strong:text-foreground",
				"prose-em:text-foreground/90",
				"prose-code:rounded prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-primary prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
				"prose-pre:bg-transparent prose-pre:p-0",
				// Links with gaming theme
				"prose-a:font-medium prose-a:text-primary prose-a:no-underline prose-a:transition-colors hover:prose-a:text-primary/80",
				"prose-a:border-primary/30 prose-a:border-b hover:prose-a:border-primary/60",
				// Lists
				"prose-ol:text-muted-foreground prose-ul:text-muted-foreground",
				"prose-li:mb-1",
				// Blockquotes with gaming styling
				"prose-blockquote:rounded-r prose-blockquote:border-primary/50 prose-blockquote:border-l-4 prose-blockquote:bg-muted/30 prose-blockquote:px-4 prose-blockquote:py-2",
				"prose-blockquote:font-medium prose-blockquote:text-foreground/90",
				// Tables
				"prose-table:overflow-hidden prose-table:rounded-lg prose-table:border prose-table:border-border",
				"prose-thead:bg-muted/50",
				"prose-th:border-border prose-th:px-4 prose-th:py-2 prose-th:font-semibold prose-th:text-foreground",
				"prose-td:border-border prose-td:px-4 prose-td:py-2 prose-td:text-muted-foreground",
				// Images
				"prose-img:rounded-lg prose-img:border prose-img:border-border/50 prose-img:shadow-lg",
				className,
			)}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeSanitize]}
				components={{
					// Enhanced code blocks with copy functionality
					pre: ({ children, className, ...props }) => {
						const codeElement = Array.isArray(children)
							? children[0]
							: children;

						const codeContent =
							typeof codeElement === "object" && codeElement?.props?.children
								? codeElement.props.children
								: "";

						const codeClassName =
							codeElement?.props?.className || className || "";

						return (
							<CodeBlock className={codeClassName.trim()} {...props}>
								{codeContent}
							</CodeBlock>
						);
					},

					// Enhanced blockquotes
					blockquote: ({ children, ...props }) => (
						<blockquote {...props} className="relative">
							<div className="-left-1 absolute top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary to-primary/50" />
							{children}
						</blockquote>
					),
					// Enhanced headings with anchor links
					h2: ({ children, ...props }) => (
						<h2 {...props} className="group relative">
							{children}
							<div className="-left-6 -translate-y-1/2 absolute top-1/2 opacity-0 transition-opacity group-hover:opacity-100">
								<div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
									<div className="h-2 w-2 rounded-full bg-primary" />
								</div>
							</div>
						</h2>
					),
					h3: ({ children, ...props }) => (
						<h3 {...props} className="group relative">
							{children}
							<div className="-left-5 -translate-y-1/2 absolute top-1/2 opacity-0 transition-opacity group-hover:opacity-100">
								<div className="flex h-3 w-3 items-center justify-center rounded-full bg-primary/20">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
								</div>
							</div>
						</h3>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
