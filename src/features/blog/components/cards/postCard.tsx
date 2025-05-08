import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { DateComponent } from "@/components/date";
import type { RouterOutputs } from "@/trpc/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";


export function PostCard({
  id,
  slug,
  title,
  createdAt,
  authorName,
  content,
  published
}: RouterOutputs["blog"]["listPosts"][number]) {
  return (
    <Link href={`/blog/${slug}`} key={id} className="block">
      <Card className="group relative h-full overflow-hidden bg-gradient-to-b from-card to-background hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription className="flex items-center gap-3 mt-2 text-sm">
            <DateComponent date={createdAt} className="text-muted-foreground/80" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose-sm line-clamp-3 text-muted-foreground/90 relative">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
              components={{
                p: ({node, ...props}) => <span {...props} />,
                h1: ({node, ...props}) => <span {...props} />,
                h2: ({node, ...props}) => <span {...props} />,
                h3: ({node, ...props}) => <span {...props} />
              }}
            >
              {content ?? "No content available"}
            </ReactMarkdown>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
