import { formatISO } from "date-fns";
import { Edit2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/app/actions/blog";
import { buttonVariants } from "@/components/ui/button";
import { BlogHero } from "@/features/blog/components/blogHero";
import { DeletePost } from "@/features/blog/components/editor/deletePost";
import { BlogLayout } from "@/features/blog/components/Layout";
import { MarkdownPreview } from "@/features/blog/components/MarkdownPreview";
import { ViewTracker } from "@/features/blog/components/viewTracker";
import { truncateText } from "@/lib/text";
import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

type Params = Promise<{ slug: string }>;

interface ViewBlogProps {
	params: Params;
}

export async function generateMetadata({
	params,
}: ViewBlogProps): Promise<Metadata> {
	const { slug } = await params;

	const post = await getBlogPost(slug).catch(() => null);
	if (!post) {
		return {
			title: "Post Not Found",
			description:
				"The blog post you are looking for could not be found on Recap.games.",
			robots: { index: false },
		};
	}

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recap.games";
	const siteName = "Games Recapped";
	const siteTwitterHandle = "@gamesrecapped";
	const siteLogoUrl = `${siteUrl}/logo.png`;

	const url = `${siteUrl}/blog/${post.slug}`;

	const publishedDate = post.scheduledAt ?? post.createdAt;
	const publishedTime = formatISO(publishedDate);
	const modifiedTime = post.updatedAt
		? formatISO(post.updatedAt)
		: publishedTime;

	const seoTitle = truncateText(`${post.title}`, 60);
	const metaDescription = truncateText(post.description, 160);

	const postImageUrl = `${siteUrl}/social-large.webp`;
	const imageAltText = post.title;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": url,
		},
		headline: post.title,
		description: post.description ?? "",
		image: postImageUrl,
		author: {
			"@type": "Person",
			name: post.authorName ?? "The Recap.games Team",
		},
		publisher: {
			"@type": "Organization",
			name: siteName,
			logo: {
				"@type": "ImageObject",
				url: siteLogoUrl,
			},
		},
		datePublished: publishedTime,
		dateModified: modifiedTime,
	};

	return {
		title: seoTitle,
		description: metaDescription,
		alternates: { canonical: url },
		robots:
			post.published === false
				? {
						index: false,
						follow: false,
						googleBot: { index: false, follow: false },
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
			title: seoTitle,
			description: metaDescription,
			url,
			siteName: siteName,
			type: "article",
			publishedTime,
			modifiedTime,
			authors: post.authorName ? [post.authorName] : [],
			images: [
				{
					url: postImageUrl,
					alt: imageAltText,
					width: 1200,
					height: 630,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: seoTitle,
			description: metaDescription,
			site: siteTwitterHandle,
			creator: siteTwitterHandle,
			images: [{ url: postImageUrl, alt: imageAltText }],
		},
		metadataBase: new URL(siteUrl),
		icons: {
			icon: "/favicon.ico",
		},
		verification: {
			google: process.env.GOOGLE_SITE_VERIFICATION ?? "",
		},
		other: {
			"application/ld+json": JSON.stringify(jsonLd),
		},
	};
}

export default async function ViewBlog(props: ViewBlogProps) {
	const { slug } = await props.params;

	const session = await auth();
	const data = await getBlogPost(slug).catch(() => null);

	if (!data) notFound();
	const isAuthor = session?.user.id === data.authorId;

	return (
		<HydrateClient>
			<BlogLayout>
				{/* Add view tracker component */}
				<ViewTracker postId={data.id} />

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
