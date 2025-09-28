import z from "zod";
import { SteamWrapper } from "@/server/utils/wrappers";
import { createTRPCRouter, publicProcedure } from "../../trpc";

const steamWrapper = SteamWrapper.getInstance();

export const steamRouter = createTRPCRouter({
	searchStore: publicProcedure
		.input(z.object({ query: z.string() }))
		.query(async ({ input }) => {
			return steamWrapper.searchStore(input.query);
		}),
	getAppDetails: publicProcedure
		.input(z.object({ appid: z.number() }))
		.query(async ({ input }) => {
			return steamWrapper.getAppDetails(input.appid);
		}),
});
