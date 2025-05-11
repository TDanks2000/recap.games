import { and, desc, eq, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import { blogComments, blogPosts, users } from "@/server/db/schema";
import {
	adminProcedure,
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "../trpc";

export const blogRouter = createTRPCRouter({
	// Fetch all published or due-scheduled blog posts with author info
	listPosts: publicProcedure.query(async ({ ctx }) => {
		const now = Math.floor(Date.now() / 1000);

		const posts = await ctx.db
			.select({
				id: blogPosts.id,
				title: blogPosts.title,
				description: blogPosts.description,
				slug: blogPosts.slug,
				published: blogPosts.published,
				scheduledAt: blogPosts.scheduledAt,
				createdAt: blogPosts.createdAt,
				authorName: users.name,
				content: blogPosts.content,
			})
			.from(blogPosts)
			.leftJoin(users, eq(blogPosts.authorId, users.id))
			.where(
				and(
					eq(blogPosts.published, true),
					or(
						isNull(blogPosts.scheduledAt),
						sql`${blogPosts.scheduledAt} <= ${now}`,
					),
				),
			)
			.orderBy(desc(blogPosts.createdAt));

		return posts;
	}),

	// Fetch a single post by slug (includes markdown content and author)
	getPostBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ ctx, input }) => {
			const now = Math.floor(Date.now() / 1000);

			const [post] = await ctx.db
				.select({
					id: blogPosts.id,
					title: blogPosts.title,
					slug: blogPosts.slug,
					content: blogPosts.content,
					published: blogPosts.published,
					scheduledAt: blogPosts.scheduledAt,
					createdAt: blogPosts.createdAt,
					updatedAt: blogPosts.updatedAt,
					authorId: blogPosts.authorId,
					authorName: users.name,
					description: blogPosts.description,
				})
				.from(blogPosts)
				.leftJoin(users, eq(blogPosts.authorId, users.id))
				.where(
					and(
						eq(blogPosts.published, true),
						eq(blogPosts.slug, input.slug),
						or(
							isNull(blogPosts.scheduledAt),
							sql`${blogPosts.scheduledAt} <= ${now}`,
						),
					),
				);

			if (!post) {
				throw new Error("Post not found");
			}

			return post;
		}),

	// Admin-only: create a new blog post
	createPost: adminProcedure
		.input(
			z.object({
				title: z.string().min(1),
				slug: z.string().min(1),
				description: z.string().min(1),
				content: z.string().min(1),
				published: z.boolean().optional(),
				scheduledAt: z.number().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const [newPost] = await ctx.db
				.insert(blogPosts)
				.values({
					title: input.title,
					slug: input.slug,
					description: input.description,
					content: input.content,
					authorId: ctx.session.user.id,
					published: input.published ?? false,
					scheduledAt:
						input.scheduledAt !== undefined
							? input.scheduledAt === null
								? null
								: new Date(input.scheduledAt * 1000)
							: null,
				})
				.returning();

			return newPost;
		}),

	// Admin-only: update an existing post
	updatePost: adminProcedure
		.input(
			z.object({
				id: z.number(),
				title: z.string().min(1).optional(),
				description: z.string().min(1).optional(),
				content: z.string().optional(),
				published: z.boolean().optional(),
				scheduledAt: z.number().nullable().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const [updated] = await ctx.db
				.update(blogPosts)
				.set({
					title: input.title,
					description: input.description,
					content: input.content,
					published: input.published,
					scheduledAt:
						input.scheduledAt === undefined
							? undefined
							: input.scheduledAt === null
								? null
								: new Date(input.scheduledAt * 1000),
					updatedAt: sql`(unixepoch())`,
				})
				.where(eq(blogPosts.id, input.id))
				.returning();

			if (!updated) {
				throw new Error("Failed to update post");
			}

			return updated;
		}),

	// Admin-only: delete a post
	deletePost: adminProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(blogPosts).where(eq(blogPosts.id, input.id));
			return { success: true };
		}),

	// Protected: add a comment to a post
	addComment: protectedProcedure
		.input(z.object({ postId: z.number(), content: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const [comment] = await ctx.db
				.insert(blogComments)
				.values({
					postId: input.postId,
					authorId: ctx.session.user.id,
					content: input.content,
				})
				.returning();

			return comment;
		}),
});
