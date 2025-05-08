import { sql } from "drizzle-orm";
import { z } from "zod";
import { MediaType } from "@/@types/db";
import { conferences, games, media, streams } from "@/server/db/schema";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const combinedRouter = createTRPCRouter({
	// Create a game and its associated media in one operation
	createGameWithMedia: adminProcedure
		.input(
			z.object({
				// Game data
				game: z.object({
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
				// Media data
				media: z.array(
					z.object({
						type: z.nativeEnum(MediaType).default(MediaType.Video),
						link: z.string().url(),
					}),
				),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Start a transaction to ensure both operations succeed or fail together
			// Insert the game first
			const game = await ctx.db
				.insert(games)
				.values({
					title: input.game.title,
					releaseDate: input.game.releaseDate,
					genres: input.game.genres
						? sql`${JSON.stringify(input.game.genres)}`
						: undefined,
					exclusive: input.game.exclusive
						? sql`${JSON.stringify(input.game.exclusive)}`
						: undefined,
					features: input.game.features
						? sql`${JSON.stringify(input.game.features)}`
						: undefined,
					developer: input.game.developer
						? sql`${JSON.stringify(input.game.developer)}`
						: undefined,
					publisher: input.game.publisher
						? sql`${JSON.stringify(input.game.publisher)}`
						: undefined,
					hidden: input.game.hidden,
					conferenceId: input.game.conferenceId,
				})
				.returning();

			if (!game[0]) {
				throw new Error("Failed to create game");
			}

			const gameId = game[0].id;

			// Insert all media items with the game ID
			const mediaItems = await Promise.all(
				input.media.map(async (mediaItem) => {
					const result = await ctx.db
						.insert(media)
						.values({
							type: mediaItem.type,
							link: mediaItem.link,
							gameId,
						})
						.returning();

					if (!result[0]) {
						throw new Error("Failed to create media item");
					}

					return result[0];
				}),
			);

			// Return both the game and its media
			return {
				game: game[0],
				media: mediaItems,
			};
		}),

	// Create a conference and its associated stream in one operation
	createConferenceWithStream: adminProcedure
		.input(
			z.object({
				// Conference data
				conference: z.object({
					name: z.string().min(1),
					startTime: z.date().optional(),
					endTime: z.date().optional(),
				}),
				// Stream data
				stream: z.object({
					title: z.string().min(1),
					link: z.string().url(),
				}),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Insert the conference first
			const conference = await ctx.db
				.insert(conferences)
				.values({
					name: input.conference.name,
					startTime: input.conference.startTime || undefined,
					endTime: input.conference.endTime || undefined,
				})
				.returning();

			if (!conference[0]) {
				throw new Error("Failed to create conference");
			}

			const conferenceId = conference[0].id;

			// Insert the stream with the conference ID
			const stream = await ctx.db
				.insert(streams)
				.values({
					title: input.stream.title,
					link: input.stream.link,
					conferenceId,
				})
				.returning();

			if (!stream[0]) {
				throw new Error("Failed to create stream");
			}

			// Return both the conference and its stream
			return {
				conference: conference[0],
				stream: stream[0],
			};
		}),
});
