import { conferences } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const conferenceRouter = createTRPCRouter({
	// Create a new conference
	create: adminProcedure
		.input(
			z.object({
				name: z.string().min(1),
				startTime: z.date().optional(),
				endTime: z.date().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { name, startTime, endTime } = input;

			const conference = await ctx.db
				.insert(conferences)
				.values({
					name,
					startTime: startTime ? startTime : undefined,
					endTime: endTime ? endTime : undefined,
				})
				.returning();

			return conference[0];
		}),

	// Delete a conference
	delete: adminProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
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
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;

			// Use date objects directly as they match the schema type
			const updateData = {
				...data,
				startTime: data.startTime ? data.startTime : undefined,
				endTime: data.endTime ? data.endTime : undefined,
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
		.input(z.object({ id: z.number() }))
		.query(async ({ ctx, input }) => {
			const { id } = input;

			const conference = await ctx.db.query.conferences.findFirst({
				where: eq(conferences.id, id),
				with: {
					games: true,
					streams: true,
				},
			});

			if (!conference) {
				throw new Error("Conference not found");
			}

			return conference;
		}),

	// Get all conferences
	getAll: publicProcedure.query(async ({ ctx }) => {
		const allConferences = await ctx.db.query.conferences.findMany({
			with: {
				games: true,
				streams: true,
			},
			orderBy: conferences.startTime,
		});

		return allConferences;
	}),
});
