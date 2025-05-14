import { formatISO } from "date-fns";
import { Edit2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { BlogHero } from "@/features/blog/components/blogHero";
import { DeletePost } from "@/features/blog/components/editor/deletePost";
import { BlogLayout } from "@/features/blog/components/Layout";
import { MarkdownPreview } from "@/features/blog/components/MarkdownPreview";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

type Params = Promise<{ slug: string }>;

interface ViewBlogProps {
	params: Params;
}

export async function generateMetadata({
	params,
}: ViewBlogProps): Promise<Metadata> {
	const { slug } = await params;

	const post = await api.blog.getPostBySlug({ slug }).catch(() => null);
	if (!post) return {};

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recap.games";
	const url = `${siteUrl}/blog/${post.slug}`;

	const publishedDate = post.scheduledAt ?? post.createdAt;
	const publishedTime = formatISO(publishedDate);
	const modifiedTime = post.updatedAt ? formatISO(post.updatedAt) : undefined;

	const defaultImage = `${siteUrl}/social-large.webp`;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.description ?? "",
		author: { "@type": "Person", name: post.authorName ?? "Unknown" },
		datePublished: publishedTime,
		dateModified: modifiedTime,
		mainEntityOfPage: { "@type": "WebPage", "@id": url },
	};

	return {
		title: post.title,
		description: post.description ?? "",
		alternates: { canonical: url },
		robots:
			post.published === false
				? {
						index: false,
						follow: true,
						googleBot: { index: false, follow: true },
					}
				: {
						index: true,
						follow: true,
						googleBot: {
							index: true,
							follow: true,
							"max-video-preview": -1,
							"max-image-preview": "large",
							"max-snippet": -1,
						},
					},
		openGraph: {
			title: post.title,
			description: post.description ?? "",
			url,
			siteName: "Games Recapped",
			type: "article",
			publishedTime,
			modifiedTime,
			authors: post.authorName ? [post.authorName] : [],
			images: [{ url: defaultImage, alt: post.title }],
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.description ?? "",
			creator: "@gamesrecapped",
			images: [defaultImage],
		},
		metadataBase: new URL(siteUrl),
		icons: { icon: "/favicon.ico" },
		verification: { google: process.env.GOOGLE_SITE_VERIFICATION ?? "" },
		other: { "application/ld+json": JSON.stringify(jsonLd) },
	};
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
					showShareButton={true}
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
					<div className="mx-auto max-w-7xl px-8 sm:px-16">
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
