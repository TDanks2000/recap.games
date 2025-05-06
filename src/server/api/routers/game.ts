import { games } from "@/server/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const gameRouter = createTRPCRouter({
	// Create a new game
	create: adminProcedure
		.input(
			z.object({
				title: z.string().min(1),
				releaseDate: z.string().optional(),
				genres: z.array(z.string()).optional(),
				exclusive: z.array(z.string()).optional(),
				features: z.array(z.string()).optional(),
				developer: z.array(z.string()).optional(),
				publisher: z.array(z.string()).optional(),
				hidden: z.boolean().optional(),
				conferenceId: z.number().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const {
				title,
				releaseDate,
				genres,
				exclusive,
				features,
				developer,
				publisher,
				hidden,
				conferenceId,
			} = input;

			const game = await ctx.db
				.insert(games)
				.values([
					{
						title,
						releaseDate,
						genres: genres ? sql`${JSON.stringify(genres)}` : undefined,
						exclusive: exclusive
							? sql`${JSON.stringify(exclusive)}`
							: undefined,
						features: features ? sql`${JSON.stringify(features)}` : undefined,
						developer: developer
							? sql`${JSON.stringify(developer)}`
							: undefined,
						publisher: publisher
							? sql`${JSON.stringify(publisher)}`
							: undefined,
						hidden,
						conferenceId,
					},
				])
				.returning();

			return game[0];
		}),

	// Delete a game
	delete: adminProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const { id } = input;

			await ctx.db.delete(games).where(eq(games.id, id));

			return { success: true };
		}),

	// Update a game
	update: adminProcedure
		.input(
			z.object({
				id: z.number(),
				title: z.string().min(1).optional(),
				releaseDate: z.string().optional(),
				genres: z.array(z.string()).optional(),
				exclusive: z.array(z.string()).optional(),
				features: z.array(z.string()).optional(),
				developer: z.array(z.string()).optional(),
				publisher: z.array(z.string()).optional(),
				hidden: z.boolean().optional(),
				conferenceId: z.number().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;

			// Convert arrays to SQL expressions for JSON strings
			const updateData = {
				...data,
				genres: data.genres ? sql`${JSON.stringify(data.genres)}` : undefined,
				exclusive: data.exclusive
					? sql`${JSON.stringify(data.exclusive)}`
					: undefined,
				features: data.features
					? sql`${JSON.stringify(data.features)}`
					: undefined,
				developer: data.developer
					? sql`${JSON.stringify(data.developer)}`
					: undefined,
				publisher: data.publisher
					? sql`${JSON.stringify(data.publisher)}`
					: undefined,
			};

			const game = await ctx.db
				.update(games)
				.set(updateData)
				.where(eq(games.id, id))
				.returning();

			return game[0];
		}),

	// Get a game by ID with related media
	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ ctx, input }) => {
			const { id } = input;

			// Set up relations
			ctx.db.query.games.findFirst;

			const game = await ctx.db.query.games.findFirst({
				where: eq(games.id, id),
				with: {
					media: true,
					conference: true,
				},
			});

			if (!game) {
				throw new Error("Game not found");
			}

			return game;
		}),

	// Get all games with related media
	getAll: publicProcedure
		.input(
			z
				.object({
					includeHidden: z.boolean().default(false),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const includeHidden = input?.includeHidden ?? false;

			const allGames = await ctx.db.query.games.findMany({
				where: includeHidden ? undefined : eq(games.hidden, false),
				with: {
					media: true,
					conference: true,
				},
				orderBy: desc(games.createdAt),
			});

			return allGames;
		}),
});
