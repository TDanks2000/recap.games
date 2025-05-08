import { FileText } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@/@types";
import { Separator } from "@/components/ui/separator";
import { BlogPostForm } from "@/features/blog/components/editor/blogPostForm";
import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

export default async function CreatePage() {
	const session = await auth();

	if (!session?.user || session.user.role !== UserRole.ADMIN) {
		redirect("/access-denied");
	}

	return (
		<HydrateClient>
			<div className="mx-auto max-w-4xl px-4 py-8">
				<div className="mb-8">
					<nav className="mb-4 flex items-center gap-2 text-sm">
						<Link href="/blog" className="transition-colors hover:text-primary">
							Blog
						</Link>
						<span className="text-muted-foreground">/</span>
						<span className="text-muted-foreground">Create Post</span>
					</nav>
					<div className="flex items-center gap-3">
						<FileText className="h-8 w-8 text-primary" />
						<div>
							<h1 className="font-bold text-2xl tracking-tight">
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
