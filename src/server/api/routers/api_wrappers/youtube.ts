import { TRPCError } from "@trpc/server";
import z from "zod";
import { Youtube } from "@/lib/youtube";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { rateLimit, throwRateLimit } from "../../utils";

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
		.query(async ({ ctx, input }) => {
			const ip = ctx.ip;
			if (!ip)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "IP address not found",
				});

			const { success, resetAfter } = await rateLimit.medium.limit(ip);
			if (!success) throwRateLimit(resetAfter);
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
		.query(async ({ ctx, input }) => {
			const ip = ctx.ip;
			if (!ip)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "IP address not found",
				});

			const { success, resetAfter } = await rateLimit.medium.limit(ip);
			if (!success) throwRateLimit(resetAfter);
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
		.query(async ({ ctx, input }) => {
			const ip = ctx.ip;
			if (!ip)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "IP address not found",
				});

			const { success, resetAfter } = await rateLimit.medium.limit(ip);
			if (!success) throwRateLimit(resetAfter);
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
