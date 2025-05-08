
import { api, HydrateClient } from "@/trpc/server";
import { BlogHero } from "@/features/blog/components/blogHero";
import { PostCard } from "@/features/blog/components/cards/postCard";
import { BlogLayout } from "@/features/blog/components/Layout";
import { Card, CardContent } from "@/components/ui/card";

export default async function BlogsPage() {
  const posts = await api.blog.listPosts();

  return (
    <HydrateClient>
      <BlogLayout>
        <BlogHero
          title="Blog Posts"
          breadcrumb={[{ href: "/blog", label: "Blog" }]}
        />

        <section 
          className="relative -mt-16 z-10"
        >
          <div className="max-w-7xl mx-auto px-8 sm:px-16">
            {!posts?.length ? (
              <Card className="mt-10 p-8">
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold leading-6">
                      No blog posts yet
                    </h3>
                    <p className="text-muted-foreground">
                      Create your first blog post to share your thoughts
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                  >
                    <PostCard {...post} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </BlogLayout>
    </HydrateClient>
  );
}
