import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { DateComponent } from "@/components/date";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { RouterOutputs } from "@/trpc/react";

export function PostCard({
	id,
	slug,
	title,
	createdAt,
	authorName,
	content,
	published,
}: RouterOutputs["blog"]["listPosts"][number]) {
	return (
		<Link href={`/blog/${slug}`} key={id} className="block">
			<Card className="group relative h-full overflow-hidden bg-gradient-to-b from-card to-background transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-xl">
				<CardHeader className="pb-3">
					<CardTitle className="line-clamp-2 font-bold text-xl transition-colors duration-300 group-hover:text-primary">
						{title}
					</CardTitle>
					<CardDescription className="mt-2 flex items-center gap-3 text-sm">
						<DateComponent
							date={createdAt}
							className="text-muted-foreground/80"
						/>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="prose-sm relative line-clamp-3 text-muted-foreground/90">
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							rehypePlugins={[rehypeSanitize]}
							components={{
								p: ({ node, ...props }) => <span {...props} />,
								h1: ({ node, ...props }) => <span {...props} />,
								h2: ({ node, ...props }) => <span {...props} />,
								h3: ({ node, ...props }) => <span {...props} />,
							}}
						>
							{content ?? "No content available"}
						</ReactMarkdown>
						<div className="absolute right-0 bottom-0 left-0 h-6 bg-gradient-to-t from-background to-transparent" />
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
