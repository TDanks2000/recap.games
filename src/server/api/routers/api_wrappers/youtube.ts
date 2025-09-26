import z from "zod";
import { Youtube } from "@/lib/youtube";
import { createTRPCRouter, publicProcedure } from "../../trpc";

const youtube = new Youtube();

export const youtubeRouter = createTRPCRouter({
	getChannelVideos: publicProcedure
		.input(
			z.object({
				channelId: z.string(),
				maxResults: z.number().optional().default(10),
				pageToken: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			const result = await youtube.getChannelVideos(
				input.channelId,
				input.maxResults,
				input.pageToken,
			);
			if ("error" in result) {
				return { error: result.error, videos: [], nextPageToken: undefined };
			}
			return result;
		}),

	getChannelInfo: publicProcedure
		.input(z.object({ channelId: z.string() }))
		.query(async ({ input }) => {
			const result = await youtube.getChannelInfo(input.channelId);
			if ("error" in result) {
				return { error: result.error };
			}
			return result;
		}),

	searchChannels: publicProcedure
		.input(
			z.object({
				query: z.string(),
				maxResults: z.number().optional().default(5),
			}),
		)
		.query(async ({ input }) => {
			const result = await youtube.searchChannels(
				input.query,
				input.maxResults,
			);
			if ("error" in result) {
				return { error: result.error };
			}
			return result;
		}),
});
