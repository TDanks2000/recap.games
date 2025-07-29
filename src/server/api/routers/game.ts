import type { AnyColumn, SQL } from "drizzle-orm";
import { and, asc, desc, eq, inArray, like, or, sql } from "drizzle-orm";
import { z } from "zod";
import { MediaType } from "@/@types";
import { conferences, games, media } from "@/server/db/schema";
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
				year: z.number().optional().default(2025),
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
				year,
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
						year,
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
			// This is correct: delete related media first.
			await ctx.db.delete(media).where(eq(media.gameId, id));
			await ctx.db.delete(games).where(eq(games.id, id));
			return { success: true };
		}),

	// Update a game (Refactored for correctness)
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
				conferenceId: z.number().optional().nullable(),
				media: z
					.array(
						z.object({
							type: z.nativeEnum(MediaType),
							link: z.string().url(),
						}),
					)
					.optional(),
				year: z.number().optional().default(2025),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, media: newMedia, ...gameData } = input;

			// A transaction is crucial here to ensure that if any part of the update fails,
			// the entire operation is rolled back, preventing inconsistent data.
			const updatedGame = await ctx.db.transaction(async (tx) => {
				// 1. Update the scalar fields on the 'games' table.
				if (Object.keys(gameData).length > 0) {
					await tx
						.update(games)
						.set({
							...gameData,
							// Handle potential JSON columns correctly
							genres: gameData.genres
								? sql`${JSON.stringify(gameData.genres)}`
								: undefined,
							exclusive: gameData.exclusive
								? sql`${JSON.stringify(gameData.exclusive)}`
								: undefined,
							features: gameData.features
								? sql`${JSON.stringify(gameData.features)}`
								: undefined,
							developer: gameData.developer
								? sql`${JSON.stringify(gameData.developer)}`
								: undefined,
							publisher: gameData.publisher
								? sql`${JSON.stringify(gameData.publisher)}`
								: undefined,
						})
						.where(eq(games.id, id));
				}

				// 2. If new media data is provided, update the related 'media' table.
				if (newMedia !== undefined) {
					// First, delete all existing media for this game.
					await tx.delete(media).where(eq(media.gameId, id));

					// Then, if the new media array is not empty, insert the new items.
					if (newMedia.length > 0) {
						await tx.insert(media).values(
							newMedia.map((item) => ({
								...item,
								gameId: id,
							})),
						);
					}
				}

				// 3. Fetch and return the final, updated game with its new relations.
				const finalGame = await tx.query.games.findFirst({
					where: eq(games.id, id),
					with: { media: true, conference: true },
				});

				if (!finalGame) {
					tx.rollback(); // Ensure transaction is aborted
					throw new Error("Game not found after update.");
				}

				return finalGame;
			});

			return updatedGame;
		}),

	// Get a game by ID with related media
	getById: publicProcedure
		.input(
			z.object({
				id: z.number(),
				year: z.number().optional().default(2025),
			}),
		)
		.query(async ({ ctx, input }) => {
			const game = await ctx.db.query.games.findFirst({
				where: eq(games.id, input.id),
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

	getAll: publicProcedure
		.input(
			z.object({
				page: z.number().min(1).optional().default(1),
				limit: z.number().min(1).max(50).optional().default(12),
				includeHidden: z.boolean().optional().default(false),
				conferenceIds: z.string().optional(),
				search: z.string().optional(),
				sort: z
					.enum(["title", "releaseDate", "date_added"])
					.optional()
					.default("date_added"),
				direction: z.enum(["asc", "desc"]).optional().default("desc"),
				year: z.number().optional().default(2025),
			}),
		)
		.query(async ({ ctx, input }) => {
			const {
				page,
				limit,
				includeHidden,
				conferenceIds,
				search,
				sort,
				direction,
				year,
			} = input;

			const conditions = [];
			if (!includeHidden) {
				conditions.push(eq(games.hidden, false));
			}

			// Filter by year
			conditions.push(eq(games.year, year));

			if (conferenceIds) {
				const parsedConferenceIds = conferenceIds
					.split(",")
					.map(Number)
					.filter((id) => !Number.isNaN(id) && id > 0);

				if (parsedConferenceIds.length > 0) {
					conditions.push(inArray(games.conferenceId, parsedConferenceIds));
				}
			}

			if (search && search.length > 0) {
				const searchPattern = `%${search.toLowerCase()}%`;

				const matchingConferences = await ctx.db
					.select({ id: conferences.id })
					.from(conferences)
					.where(like(sql`lower(${conferences.name})`, searchPattern));

				const matchingConferenceIds = matchingConferences.map((c) => c.id);

				const searchConditions = [
					like(sql`lower(${games.title})`, searchPattern),
				];

				if (matchingConferenceIds.length > 0) {
					searchConditions.push(
						inArray(games.conferenceId, matchingConferenceIds),
					);
				}
				conditions.push(or(...searchConditions));
			}

			const whereCondition =
				conditions.length > 0 ? and(...conditions) : undefined;

			const sortDirection = direction === "asc" ? asc : desc;
			let orderByClause: SQL | AnyColumn | undefined;
			switch (sort) {
				case "title":
					orderByClause = sortDirection(games.title);
					break;
				case "releaseDate":
					orderByClause = sortDirection(games.releaseDate);
					break;
				default:
					orderByClause = sortDirection(games.createdAt);
					break;
			}

			const [pagedGames, totalCountResult] = await Promise.all([
				ctx.db.query.games.findMany({
					where: whereCondition,
					with: {
						media: true,
						conference: true,
					},
					orderBy: orderByClause,
					limit: limit,
					offset: (page - 1) * limit,
				}),
				ctx.db
					.select({ count: sql<number>`count(*)`.mapWith(Number) })
					.from(games)
					.where(whereCondition),
			]);

			const totalItems = totalCountResult[0]?.count ?? 0;
			const totalPages = Math.ceil(totalItems / limit);

			return {
				items: pagedGames,
				totalPages,
				currentPage: page,
				totalItems,
			};
		}),

	// Get all available years from games
	getAvailableYears: publicProcedure.query(async ({ ctx }) => {
		const years = await ctx.db
			.selectDistinct({ year: games.year })
			.from(games)
			.where(eq(games.hidden, false))
			.orderBy(desc(games.year));

		return years.map((y) => y.year).filter((year) => year !== null);
	}),
});
