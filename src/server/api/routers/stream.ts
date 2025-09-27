import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { streams } from "@/server/db/schema";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { rateLimit, throwRateLimit } from "../utils";

export const streamRouter = createTRPCRouter({
	// Create a new stream
	create: adminProcedure
		.input(
			z.object({
				title: z.string().min(1),
				link: z.string().url(),
				conferenceId: z.number(),
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
			const { title, link, conferenceId } = input;

			const stream = await ctx.db
				.insert(streams)
				.values({
					title,
					link,
					conferenceId,
				})
				.returning();

			return stream[0];
		}),

	// Delete a stream
	delete: adminProcedure
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
			const { id } = input;

			await ctx.db.delete(streams).where(eq(streams.id, id));

			return { success: true };
		}),

	// Update a stream
	update: adminProcedure
		.input(
			z.object({
				id: z.number(),
				title: z.string().min(1).optional(),
				link: z.string().url().optional(),
				conferenceId: z.number().optional(),
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
			const { id, ...data } = input;

			const stream = await ctx.db
				.update(streams)
				.set(data)
				.where(eq(streams.id, id))
				.returning();

			return stream[0];
		}),

	// Get a stream by ID
	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ ctx, input }) => {
			const ip = ctx.ip;
			if (!ip)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "IP address not found",
				});

			const { success, resetAfter } = await rateLimit.low.limit(ip);
			if (!success) throwRateLimit(resetAfter);
			const { id } = input;

			const stream = await ctx.db
				.select()
				.from(streams)
				.where(eq(streams.id, id));

			if (!stream?.length) {
				throw new Error("Stream not found");
			}

			return stream[0];
		}),

	// Get all streams
	getAll: publicProcedure
		.input(
			z
				.object({
					conferenceId: z.number().optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const ip = ctx.ip;
			if (!ip)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "IP address not found",
				});

			const { success, resetAfter } = await rateLimit.low.limit(ip);
			if (!success) throwRateLimit(resetAfter);
			const query = ctx.db.select().from(streams);

			if (input?.conferenceId) {
				query.where(eq(streams.conferenceId, input.conferenceId));
			}

			const allStreams = await query.orderBy(streams.title);

			return allStreams;
		}),
});
