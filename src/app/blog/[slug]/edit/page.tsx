import { FileText } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UserRole } from "@/@types";
import { Separator } from "@/components/ui/separator";
import { BlogPostForm } from "@/features/blog/components/editor/blogPostForm";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

type Params = Promise<{ slug: string }>;

interface EditPageProps {
	params: Params;
}

export default async function EditPage(props: EditPageProps) {
	const session = await auth();

	if (!session?.user || session.user.role !== UserRole.ADMIN) {
		redirect("/access-denied");
	}

	const { slug } = await props.params;

	const post = await api.blog.getPostBySlug({ slug }).catch(() => null);

	if (!post) notFound();
	if (session?.user.id !== post.authorId) notFound();

	return (
		<HydrateClient>
			<div className="mx-auto max-w-6xl px-4 py-8">
				<div className="mb-8">
					<nav className="mb-4 flex items-center gap-2 text-sm">
						<Link href="/blog" className="transition-colors hover:text-primary">
							Blog
						</Link>
						<span className="text-muted-foreground">/</span>
						<Link
							href={`/blog/${slug}`}
							className="transition-colors hover:text-primary"
						>
							{post.title}
						</Link>
						<span className="text-muted-foreground">/</span>
						<span className="text-muted-foreground">Edit</span>
					</nav>
					<div className="flex items-center gap-3">
						<FileText className="h-8 w-8 text-primary" />
						<div>
							<h1 className="font-bold text-2xl tracking-tight">
								Edit Blog Post
							</h1>
							<p className="text-muted-foreground">
								Edit your blog post title and content.
							</p>
						</div>
					</div>
				</div>
				<Separator className="my-6" />
				<BlogPostForm
					initialData={{
						...post,
						published: post.published ?? false,
						description: post.description ?? undefined,
					}}
					isEditing={true}
					id={post.id}
				/>
			</div>
		</HydrateClient>
	);
}
