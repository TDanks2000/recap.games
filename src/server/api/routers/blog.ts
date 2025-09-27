import { TRPCError } from "@trpc/server";
import { and, desc, eq, gte, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import {
	blogComments,
	blogPostAnalytics,
	blogPosts,
	blogPostViews,
	users,
} from "@/server/db/schema";
import {
	adminProcedure,
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "../trpc";
import { rateLimit, throwRateLimit } from "../utils";

const DEBOUNCE_SECONDS = 60 * 60; // 1 hour

export const blogRouter = createTRPCRouter({
	// Admin-only: get aggregated analytics for all blog posts
	getAllPostsAnalytics: adminProcedure.query(async ({ ctx }) => {
		const ip = ctx.ip;
		if (!ip)
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "IP address not found",
			});

		const { success, resetAfter } = await rateLimit.high.limit(ip);
		if (!success) throwRateLimit(resetAfter);
		// Get analytics for all posts with post title
		const postsWithAnalytics = await ctx.db
			.select({
				// Post details
				postId: blogPostAnalytics.postId,
				title: blogPosts.title,
				slug: blogPosts.slug,
				scheduledAt: blogPosts.scheduledAt,
				createdAt: blogPosts.createdAt,
				updatedAt: blogPosts.updatedAt,

				// Analytics
				viewCount: blogPostAnalytics.viewCount,
				uniqueViewCount: blogPostAnalytics.uniqueViewCount,
				registeredViewCount: blogPostAnalytics.registeredViewCount,
				anonViewCount: blogPostAnalytics.anonViewCount,
				averageReadTime: blogPostAnalytics.averageReadTime,
				lastViewedAt: blogPostAnalytics.lastViewedAt,
			})
			.from(blogPostAnalytics)
			.innerJoin(blogPosts, eq(blogPostAnalytics.postId, blogPosts.id))
			.orderBy(desc(blogPostAnalytics.viewCount));

		// Calculate total views across all posts
		const totalStats = {
			totalViews: postsWithAnalytics.reduce(
				(sum, post) => sum + (post.viewCount || 0),
				0,
			),
			totalUniqueViews: postsWithAnalytics.reduce(
				(sum, post) => sum + (post.uniqueViewCount || 0),
				0,
			),
			totalRegisteredViews: postsWithAnalytics.reduce(
				(sum, post) => sum + (post.registeredViewCount || 0),
				0,
			),
			totalAnonViews: postsWithAnalytics.reduce(
				(sum, post) => sum + (post.anonViewCount || 0),
				0,
			),
			averageReadTimeAcrossAllPosts:
				postsWithAnalytics.length > 0
					? Math.round(
							postsWithAnalytics.reduce(
								(sum, post) => sum + (post.averageReadTime || 0),
								0,
							) / postsWithAnalytics.length,
						)
					: 0,
		};

		// Get top 5 posts by viewCount
		const topPosts = postsWithAnalytics.slice(0, 5);

		return {
			postsWithAnalytics,
			totalStats,
			topPosts,
		};
	}),

	// Admin-only: get detailed analytics for a post
	getPostAnalytics: adminProcedure
		.input(z.object({ postId: z.number() }))
		.query(async ({ ctx, input }) => {
			const ip = ctx.ip;
			if (!ip)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "IP address not found",
				});

			const { success, resetAfter } = await rateLimit.high.limit(ip);
			if (!success) throwRateLimit(resetAfter);
			// Get the basic analytics data
			const analytics = await ctx.db
				.select()
				.from(blogPostAnalytics)
				.where(eq(blogPostAnalytics.postId, input.postId))
				.get();

			if (!analytics) {
				throw new Error("Analytics not found for this post");
			}

			// Get recent views for time-based analysis
			const recentViews = await ctx.db
				.select()
				.from(blogPostViews)
				.where(eq(blogPostViews.postId, input.postId))
				.orderBy(desc(blogPostViews.viewedAt))
				.limit(100);

			// Get referrer statistics
			const referrerStats = await ctx.db
				.select({
					referrer: blogPostViews.referrer,
					count: sql`count(*)`,
				})
				.from(blogPostViews)
				.where(eq(blogPostViews.postId, input.postId))
				.groupBy(blogPostViews.referrer)
				.orderBy(sql`count(*) desc`)
				.limit(10);

			return {
				analytics,
				recentViews,
				referrerStats,
				// Calculate additional metrics
				metrics: {
					registeredToAnonymousRatio:
						(analytics.anonViewCount ?? 0) > 0
							? (analytics.registeredViewCount ?? 0) /
								(analytics.anonViewCount ?? 0)
							: (analytics.registeredViewCount ?? 0) > 0
								? 1
								: 0,
					averageReadTimeMinutes:
						Math.round(((analytics.averageReadTime ?? 0) / 60) * 10) / 10,
					engagementRate:
						(analytics.viewCount ?? 0) > 0
							? (recentViews.filter((v) => v.readTime && v.readTime > 30)
									.length /
									recentViews.length) *
								100
							: 0,
				},
			};
		}),

	// Fetch all published or due-scheduled blog posts with author info and analytics
	listPosts: publicProcedure.query(async ({ ctx }) => {
		const ip = ctx.ip;
		if (!ip)
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "IP address not found",
			});

		const { success, resetAfter } = await rateLimit.low.limit(ip);
		if (!success) throwRateLimit(resetAfter);
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
				viewCount: blogPostAnalytics.viewCount,
				updatedAt: blogPosts.updatedAt,
			})
			.from(blogPosts)
			.leftJoin(users, eq(blogPosts.authorId, users.id))
			.leftJoin(blogPostAnalytics, eq(blogPosts.id, blogPostAnalytics.postId))
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

	// Fetch a single post by slug (includes markdown content, author, and analytics)
	getPostBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ ctx, input }) => {
			const ip = ctx.ip;
			if (!ip)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "IP address not found",
				});

			const { success, resetAfter } = await rateLimit.low.limit(ip);
			if (!success) throwRateLimit(resetAfter);
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
					viewCount: blogPostAnalytics.viewCount,
				})
				.from(blogPosts)
				.leftJoin(users, eq(blogPosts.authorId, users.id))
				.leftJoin(blogPostAnalytics, eq(blogPosts.id, blogPostAnalytics.postId))
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

	// Admin-only: create a new blog post and initialize analytics
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
			const ip = ctx.ip;
			if (!ip)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "IP address not found",
				});

			const { success, resetAfter } = await rateLimit.high.limit(ip);
			if (!success) throwRateLimit(resetAfter);
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

			if (newPost?.id)
				await ctx.db.insert(blogPostAnalytics).values({ postId: newPost.id });

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
			const ip = ctx.ip;
			if (!ip)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "IP address not found",
				});

			const { success, resetAfter } = await rateLimit.high.limit(ip);
			if (!success) throwRateLimit(resetAfter);
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

	// Admin-only: delete a post and its analytics
	deletePost: adminProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const ip = ctx.ip;
			if (!ip)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "IP address not found",
				});

			const { success, resetAfter } = await rateLimit.high.limit(ip);
			if (!success) throwRateLimit(resetAfter);
			await ctx.db
				.delete(blogPostAnalytics)
				.where(eq(blogPostAnalytics.postId, input.id));
			await ctx.db.delete(blogPosts).where(eq(blogPosts.id, input.id));
			return { success: true };
		}),

	// Protected: add a comment to a post
	addComment: protectedProcedure
		.input(z.object({ postId: z.number(), content: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const ip = ctx.ip;
			if (!ip)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "IP address not found",
				});

			const { success, resetAfter } = await rateLimit.medium.limit(ip);
			if (!success) throwRateLimit(resetAfter);
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

	recordView: publicProcedure
		.input(
			z.object({
				postId: z.number(),
				sessionId: z.string().optional(),
				readTime: z.number().optional(), // Time spent reading in seconds
				referrer: z.string().optional(), // Where the user came from
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const ip = ctx.ip;
			if (!ip)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "IP address not found",
				});

			const { success, resetAfter } = await rateLimit.low.limit(ip);
			if (!success) throwRateLimit(resetAfter);
			const now = new Date();
			const userId = ctx.session?.user?.id ?? null;
			const sessionId = userId ? null : (input.sessionId ?? null);
			const isRegisteredUser = !!userId;

			// Build the where clause for this user/session
			const userOrSessionClause = userId
				? eq(blogPostViews.userId, userId)
				: and(
						isNull(blogPostViews.userId),
						sessionId === null
							? isNull(blogPostViews.sessionId)
							: eq(blogPostViews.sessionId, sessionId),
					);

			// Check for any previous view (for unique visitor logic)
			const anyPreviousView = await ctx.db
				.select()
				.from(blogPostViews)
				.where(and(eq(blogPostViews.postId, input.postId), userOrSessionClause))
				.get();

			// Check for recent view (for debouncing)
			const recentView = await ctx.db
				.select()
				.from(blogPostViews)
				.where(
					and(
						eq(blogPostViews.postId, input.postId),
						gte(
							blogPostViews.viewedAt,
							new Date(Date.now() - DEBOUNCE_SECONDS * 1000),
						),
						userOrSessionClause,
					),
				)
				.get();
			// Always record the view for analytics purposes
			await ctx.db
				.insert(blogPostViews)
				.values({
					postId: input.postId,
					userId,
					sessionId,
					referrer: input.referrer ?? null,
					readTime: input.readTime ?? null,
					viewedAt: now,
				})
				.catch((error) => {
					if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
						console.error("Row already exists");
					} else {
						console.error("Error recording view:", error);
					}
				});

			// Only update analytics if this view isn't debounced
			if (!recentView) {
				// Prepare analytics update
				const analyticsUpdate: Record<string, unknown> = {
					viewCount: sql`COALESCE(${blogPostAnalytics.viewCount}, 0) + 1`,
					lastViewedAt: now,
					updatedAt: now,
				};

				// Registered/anon view counts
				if (isRegisteredUser) {
					analyticsUpdate.registeredViewCount = sql`COALESCE(${blogPostAnalytics.registeredViewCount}, 0) + 1`;
				} else {
					analyticsUpdate.anonViewCount = sql`COALESCE(${blogPostAnalytics.anonViewCount}, 0) + 1`;
				}

				// Unique view count
				if (!anyPreviousView) {
					analyticsUpdate.uniqueViewCount = sql`COALESCE(${blogPostAnalytics.uniqueViewCount}, 0) + 1`;
				}

				// Average read time
				if (input.readTime && input.readTime > 0) {
					analyticsUpdate.averageReadTime = sql`
            (COALESCE(${blogPostAnalytics.averageReadTime}, 0) * COALESCE(${blogPostAnalytics.viewCount}, 0) + ${input.readTime}) /
            (COALESCE(${blogPostAnalytics.viewCount}, 0) + 1)
          `;
				}

				// Try to update analytics
				const updated = await ctx.db
					.update(blogPostAnalytics)
					.set(analyticsUpdate)
					.where(eq(blogPostAnalytics.postId, input.postId))
					.returning({
						viewCount: blogPostAnalytics.viewCount,
						uniqueViewCount: blogPostAnalytics.uniqueViewCount,
						averageReadTime: blogPostAnalytics.averageReadTime,
					})
					.get();

				// If analytics record doesn't exist, create it
				if (!updated) {
					const initialAnalytics = {
						postId: input.postId,
						viewCount: 1,
						uniqueViewCount: 1,
						registeredViewCount: isRegisteredUser ? 1 : 0,
						anonViewCount: isRegisteredUser ? 0 : 1,
						averageReadTime: input.readTime ?? 0,
						lastViewedAt: now,
						updatedAt: now,
						createdAt: now,
					};
					await ctx.db.insert(blogPostAnalytics).values(initialAnalytics);

					return {
						success: true,
						viewCount: 1,
						uniqueViewCount: 1,
						averageReadTime: input.readTime ?? 0,
						debounced: false,
						isNewVisitor: true,
					};
				}

				return {
					success: true,
					viewCount: updated.viewCount,
					uniqueViewCount: updated.uniqueViewCount,
					averageReadTime: updated.averageReadTime,
					debounced: false,
					isNewVisitor: !anyPreviousView,
				};
			}

			// Recent view exists: do not increment analytics counters
			return {
				success: true,
				debounced: true,
				isNewVisitor: !anyPreviousView,
			};
		}),
});
