import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { conferenceRouter, gameRouter, streamRouter } from "./routers";
import { combinedRouter } from "./routers/combined";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  game: gameRouter,
  stream: streamRouter,
  conference: conferenceRouter,
  combined: combinedRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
