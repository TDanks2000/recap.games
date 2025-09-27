import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { conferences } from "@/server/db/schema";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { rateLimit, throwRateLimit } from "../utils";

export const conferenceRouter = createTRPCRouter({
	// Create a new conference
	create: adminProcedure
		.input(
			z.object({
				name: z.string().min(1),
				startTime: z.date().optional(),
				endTime: z.date().optional(),
				year: z.number().optional().default(2025),
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
			const { name, startTime, endTime, year } = input;

			const conference = await ctx.db
				.insert(conferences)
				.values({
					name,
					startTime: startTime ?? undefined,
					endTime: endTime ?? undefined,
					year,
				})
				.returning();

			return conference[0];
		}),

	// Delete a conference
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

			await ctx.db.delete(conferences).where(eq(conferences.id, id));

			return { success: true };
		}),

	// Update a conference
	update: adminProcedure
		.input(
			z.object({
				id: z.number(),
				name: z.string().min(1).optional(),
				startTime: z.date().optional(),
				endTime: z.date().optional(),
				year: z.number().optional().default(2025),
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
			const updateData = {
				...data,
				startTime: data.startTime ?? undefined,
				endTime: data.endTime ?? undefined,
				year: data.year ?? undefined,
			};

			const conference = await ctx.db
				.update(conferences)
				.set(updateData)
				.where(eq(conferences.id, id))
				.returning();

			return conference[0];
		}),

	// Get a conference by ID
	getById: publicProcedure
		.input(
			z.object({ id: z.number(), year: z.number().optional().default(2025) }),
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
			const conference = await ctx.db.query.conferences.findFirst({
				where: eq(conferences.id, input.id),
				with: {
					games: true,
					streams: true,
				},
			});

			if (!conference) throw new Error("Conference not found");
			return conference;
		}),

	// Get all conferences with improved sorting
	getAll: publicProcedure
		.input(
			z.optional(
				z.object({
					withGames: z.literal(true).optional(),
					withStreams: z.literal(true).optional().default(true),
					year: z.number().optional().default(2025),
				}),
			),
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
			const { withGames, withStreams, year } = input ?? {};
			const allConferences = await ctx.db.query.conferences.findMany({
				with: {
					games: withGames,
					streams: withStreams,
				},
				where: year ? eq(conferences.year, year) : undefined,
			});

			return allConferences;
		}),

	// Get all available years from conferences
	getAvailableYears: publicProcedure.query(async ({ ctx }) => {
		const ip = ctx.ip;
		if (!ip)
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "IP address not found",
			});

		const { success, resetAfter } = await rateLimit.low.limit(ip);
		if (!success) throwRateLimit(resetAfter);
		const years = await ctx.db
			.selectDistinct({ year: conferences.year })
			.from(conferences)
			.orderBy(desc(conferences.year));

		return years.map((y) => y.year).filter((year) => year !== null);
	}),
});
