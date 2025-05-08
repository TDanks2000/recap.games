import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { BlogHero } from "@/features/blog/components/blogHero";
import { DeletePost } from "@/features/blog/components/editor/deletePost";
import { BlogLayout } from "@/features/blog/components/Layout";
import { MarkdownPreview } from "@/features/blog/components/MarkdownPreview";
import { buttonVariants } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

type Params = Promise<{ slug: string }>;

interface ViewBlogProps {
    params: Params;
}

export default async function ViewBlog(props: ViewBlogProps) {
  const { slug } = await props.params;
  

  const session = await auth();
  const data = await api.blog.getPostBySlug({ slug }).catch(() => null);

  if (!data) notFound();
  const isAuthor = session?.user.id === data.authorId;

  return (
    <HydrateClient>
      <BlogLayout>
        <BlogHero
          title={data.title}
          breadcrumb={[{ href: "/blog", label: "Blog" }]}
          render={
            isAuthor && (
              <div className="mx-auto mt-6 flex space-x-4">
                <Link
                  href={`/blog/${data.slug}/edit`}
                  className={buttonVariants()}
                >
                  <Edit2 />
                  Edit
                </Link>
                <DeletePost id={data.id} />
              </div>
            )
          }
        />

        <section className="relative z-10">
          <div className="max-w-7xl mx-auto px-8 sm:px-16">
            <MarkdownPreview
              content={data.content}
              className="!border-none prose prose-lg max-w-none py-8"
            />
          </div>
        </section>
      </BlogLayout>
    </HydrateClient>
  );
}
