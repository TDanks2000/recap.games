import { FileText } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { BlogPostForm } from "@/features/blog/components/editor/blogPostForm";
import { api, HydrateClient } from "@/trpc/server";
import { auth } from "@/server/auth";
import { UserRole } from "@/@types";


type Params = Promise<{ slug: string }>;

interface EditPageProps {
    params: Params;
}

export default async function EditPage(props: EditPageProps) {	
  const session = await auth();

	if (!session?.user || session.user.role !== UserRole.ADMIN) {
		redirect("/access-denied");
	}

  const {slug}  = await props.params;
  
	const post = await api.blog.getPostBySlug({ slug }).catch(() => null);

	if (!post) notFound();
	if (session?.user.id !== post.authorId) notFound();

	return (
		<HydrateClient>
			<div className="mx-auto max-w-4xl py-8 px-4">
				<div className="mb-8">
					<nav className="mb-4 flex items-center gap-2 text-sm">
						<Link href="/blog" className="hover:text-primary transition-colors">
							Blog
						</Link>
						<span className="text-muted-foreground">/</span>
						<Link
							href={`/blog/${slug}`}
							className="hover:text-primary transition-colors"
						>
							{post.title}
						</Link>
						<span className="text-muted-foreground">/</span>
						<span className="text-muted-foreground">Edit</span>
					</nav>
					<div className="flex items-center gap-3">
						<FileText className="h-8 w-8 text-primary" />
						<div>
							<h1 className="text-2xl font-bold tracking-tight">
								Edit Blog Post
							</h1>
							<p className="text-muted-foreground">
								Edit your blog post title and content.
							</p>
						</div>
					</div>
				</div>
				<Separator className="my-6" />
				<BlogPostForm initialData={{
          ...post,
          published: post.published ?? false
        }} isEditing={true} id={post.id} />
			</div>
		</HydrateClient>
	);
}
