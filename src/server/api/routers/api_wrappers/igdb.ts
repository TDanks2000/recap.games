import { z } from "zod";
import { type GameFilters, IGDBWrapper } from "@/server/utils/wrappers";
import { createTRPCRouter, publicProcedure } from "../../trpc";

const igdb = IGDBWrapper.getInstance();

export const igdbRouter = createTRPCRouter({
	search: publicProcedure
		.input(
			z.object({
				query: z.string().min(1, "Search query cannot be empty"),
				limit: z.number().int().positive().optional().default(20),
				offset: z.number().int().min(0).optional().default(0),
			}),
		)
		.query(async ({ input }) => {
			const result = await igdb.search(input.query, input.limit, input.offset);
			return result;
		}),

	info: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input }) => {
			const result = await igdb.info(input.id);
			return result;
		}),

	top_rated: publicProcedure
		.input(
			z.object({
				limit: z.number().int().positive().optional().default(20),
				offset: z.number().int().min(0).optional().default(0),
			}),
		)
		.query(async ({ input }) => {
			const result = await igdb.topRated(input.limit, input.offset);
			return result;
		}),

	new_releases: publicProcedure
		.input(
			z.object({
				limit: z.number().int().positive().optional().default(20),
				offset: z.number().int().min(0).optional().default(0),
			}),
		)
		.query(async ({ input }) => {
			const result = await igdb.newReleases(input.limit, input.offset);
			return result;
		}),

	most_anticipated: publicProcedure
		.input(
			z.object({
				limit: z.number().int().positive().optional().default(20),
				offset: z.number().int().min(0).optional().default(0),
			}),
		)
		.query(async ({ input }) => {
			const result = await igdb.mostAnticipated(input.limit, input.offset);
			return result;
		}),

	by_genre: publicProcedure
		.input(
			z.object({
				genre: z.string(),
				limit: z.number().int().positive().optional().default(20),
				offset: z.number().int().min(0).optional().default(0),
			}),
		)
		.query(async ({ input }) => {
			const result = await igdb.byGenre(input.genre, input.limit, input.offset);
			return result;
		}),

	by_multiple_genres: publicProcedure
		.input(
			z.object({
				genreIds: z.array(z.number().int().positive()).min(1),
				limit: z.number().int().positive().optional().default(20),
				offset: z.number().int().min(0).optional().default(0),
			}),
		)
		.query(async ({ input }) => {
			const result = await igdb.byMultipleGenres(
				input.genreIds,
				input.limit,
				input.offset,
			);

			return result;
		}),

	similar_games: publicProcedure
		.input(
			z.object({
				gameId: z.string(),
				limit: z.number().int().positive().optional().default(20),
				offset: z.number().int().min(0).optional().default(0),
			}),
		)
		.query(async ({ input }) => {
			const result = await igdb.similarGames(
				input.gameId,
				input.limit,
				input.offset,
			);
			return result;
		}),

	genres: publicProcedure
		.input(
			z.object({
				limit: z.number().int().positive().optional().default(20),
				offset: z.number().int().min(0).optional().default(0),
			}),
		)
		.query(async ({ input }) => {
			const result = await igdb.getGenres(input.limit, input.offset);
			return result;
		}),

	companies: publicProcedure
		.input(
			z.object({
				ids: z.array(z.number().int().positive()),
			}),
		)
		.query(async ({ input }) => {
			const result = await igdb.getCompanies(input.ids);
			return result;
		}),

	themes: publicProcedure
		.input(
			z.object({
				limit: z.number().int().positive().optional().default(20),
				offset: z.number().int().min(0).optional().default(0),
			}),
		)
		.query(async ({ input }) => {
			const result = await igdb.getThemes(input.limit, input.offset);
			return result;
		}),

	game_modes: publicProcedure
		.input(
			z.object({
				limit: z.number().int().positive().optional().default(20),
				offset: z.number().int().min(0).optional().default(0),
			}),
		)
		.query(async ({ input }) => {
			const result = await igdb.getGameModes(input.limit, input.offset);
			return result;
		}),

	filter: publicProcedure
		.input(
			z.object({
				limit: z.number().int().positive().optional().default(20),
				offset: z.number().int().min(0).optional().default(0),
				sort: z.string().optional(),
				platforms: z.array(z.number().int().positive()).optional(),
				genreIds: z.array(z.number().int().positive()).optional(),
				themes: z.array(z.number().int().positive()).optional(),
				gameModes: z.array(z.number().int().positive()).optional(),
				playerPerspectiveIds: z.array(z.number().int().positive()).optional(),
				minRating: z.number().min(0).max(100).optional(),
				maxRating: z.number().min(0).max(100).optional(),
				minRatingCount: z.number().int().min(0).optional(),
				releaseDateFrom: z.number().int().positive().optional(),
				releaseDateTo: z.number().int().positive().optional(),
				minHypes: z.number().int().min(0).optional(),
				onlyMainGames: z.boolean().optional(),
				excludeVersions: z.boolean().optional(),
				developerIds: z.array(z.number().int().positive()).optional(),
				publisherIds: z.array(z.number().int().positive()).optional(),
			}),
		)
		.query(async ({ input }) => {
			const { limit, offset, sort, ...filters } = input;
			const result = await igdb.filter(filters, sort, limit, offset);

			return result;
		}),

	calendarReleases: publicProcedure
		.input(
			z.object({
				year: z.number().int().min(1970).max(2100),
				month: z.number().int().min(0).max(11),
				limit: z.number().int().positive().optional().default(100),
				offset: z.number().int().min(0).optional().default(0),
			}),
		)
		.query(async ({ input }) => {
			const { year, month, limit, offset } = input;

			const startDate = new Date(year, month, 1).getTime();
			const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();

			const filters: GameFilters = {
				releaseDateFrom: startDate,
				releaseDateTo: endDate,
				onlyMainGames: true,
				excludeVersions: true,
				minHypes: 1,
			};

			const result = await igdb.filter(
				filters,
				"first_release_date asc",
				limit,
				offset,
			);

			return result;
		}),
});
