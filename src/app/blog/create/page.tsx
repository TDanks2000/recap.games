import { FileText } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { BlogPostForm } from "@/features/blog/components/editor/blogPostForm";
import { HydrateClient } from "@/trpc/server";
import { auth } from "@/server/auth";
import { UserRole } from "@/@types";
import { redirect } from "next/navigation";

export default async function CreatePage() {
  const session = await auth();

	if (!session?.user || session.user.role !== UserRole.ADMIN) {
		redirect("/access-denied");
	}

	return (
		<HydrateClient>
			<div className="mx-auto max-w-4xl py-8 px-4">
				<div className="mb-8">
					<nav className="mb-4 flex items-center gap-2 text-sm">
						<Link href="/blog" className="hover:text-primary transition-colors">
							Blog
						</Link>
						<span className="text-muted-foreground">/</span>
						<span className="text-muted-foreground">Create Post</span>
					</nav>
					<div className="flex items-center gap-3">
						<FileText className="h-8 w-8 text-primary" />
						<div>
							<h1 className="text-2xl font-bold tracking-tight">
								Create New Blog Post
							</h1>
							<p className="text-muted-foreground">
								Create a new blog post with a title and content.
							</p>
						</div>
					</div>
				</div>
				<Separator className="my-6" />
				<BlogPostForm />
			</div>
		</HydrateClient>
	);
}
