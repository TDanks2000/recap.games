import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { DateComponent } from "@/components/date";
import { useReadingTime } from "@/lib/readingTime";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/react";

type Post = RouterOutputs["blog"]["listPosts"]["posts"][number];

interface PostCardProps extends Post {
	size?: "default" | "large";
}

export function PostCard({
	slug,
	title,
	description,
	createdAt,
	content,
	size = "default",
}: PostCardProps) {
	const { text: readingTime } = useReadingTime(content, {
		contentType: "blog",
	});

	return (
		<Link href={`/blog/${slug}`} className="group block h-full">
			<article
				className={cn(
					"relative flex h-full min-h-64 flex-col overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-card/80 transition-all duration-300",
					"hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10",
					"before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
				)}
			>
				{/* Top accent line */}
				<div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

				<div className="relative z-10 flex h-full flex-col p-6">
					{/* Header */}
					<header className="mb-4">
						<h2
							className={cn(
								"line-clamp-2 font-bold text-foreground leading-tight transition-colors duration-300 group-hover:text-primary",
								size === "large" ? "mb-3 text-xl" : "mb-2 text-lg",
							)}
						>
							{title}
						</h2>
						{/* Metadata */}
						<div className="flex items-center gap-3 text-muted-foreground text-sm">
							<div className="flex items-center gap-1.5">
								<Calendar className="h-3.5 w-3.5" />
								<DateComponent date={createdAt} />
							</div>
							<div className="h-3 w-px bg-border" />
							<div className="flex items-center gap-1.5">
								<Clock className="h-3.5 w-3.5" />
								<span>{readingTime}</span>
							</div>
						</div>
					</header>

					{/* Content Preview */}
					<div className="mb-4 flex-1">
						<div className="line-clamp-3 text-muted-foreground text-sm leading-relaxed">
							{description ? (
								<p>{description}</p>
							) : (
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									rehypePlugins={[rehypeSanitize]}
									components={{
										p: ({ node, ...props }) => <span {...props} />,
										h1: ({ node, ...props }) => <span {...props} />,
										h2: ({ node, ...props }) => <span {...props} />,
										h3: ({ node, ...props }) => <span {...props} />,
										strong: ({ node, ...props }) => (
											<strong
												className="font-medium text-foreground"
												{...props}
											/>
										),
										em: ({ node, ...props }) => (
											<em className="text-foreground/80" {...props} />
										),
									}}
								>
									{content ?? "No content available"}
								</ReactMarkdown>
							)}
						</div>
					</div>

					{/* CTA Footer */}
					<footer className="mt-auto flex items-center justify-between border-border/30 border-t pt-4">
						<span className="font-medium text-muted-foreground/70 text-xs uppercase tracking-wider">
							Read More
						</span>
						<ArrowRight className="size-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
					</footer>
				</div>

				{/* Gaming-inspired geometric accents */}
				<div className="-bottom-2 -right-2 absolute h-16 w-16 rotate-45 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				<div className="-top-2 -left-2 absolute h-12 w-12 rotate-45 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
			</article>
		</Link>
	);
}
