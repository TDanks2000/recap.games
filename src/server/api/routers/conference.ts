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
      })
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
      })
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
  getAll: publicProcedure
    .input(
      z.optional(
        z.object({
          withGames: z.literal(true).optional(),
          withStreams: z.literal(true).optional().default(true),
        })
      )
    )
    .query(async ({ ctx, input }) => {
      const { withGames, withStreams } = input ?? {};
      const allConferences = await ctx.db.query.conferences.findMany({
        with: {
          games: withGames,
          streams: withStreams,
        },
      });

      const now = new Date();
      const sortedConferences = allConferences.sort((a, b) => {
        // Helper function to determine conference status
        const getConferenceStatus = (conf: typeof a) => {
          const endTime = conf.endTime ? new Date(conf.endTime) : null;
          const startTime = conf.startTime ? new Date(conf.startTime) : null;

          if (endTime && endTime < now) return "ended";
          if (startTime) {
            if (startTime > now) return "upcoming";
            if (!endTime || endTime > now) return "ongoing";
            return "ended";
          }
          return "unknown";
        };

        const statusA = getConferenceStatus(a);
        const statusB = getConferenceStatus(b);

        // First, group by status priority
        const statusPriority = {
          upcoming: 0,
          ongoing: 1,
          ended: 2,
          unknown: 3,
        };
        if (statusPriority[statusA] !== statusPriority[statusB]) {
          return statusPriority[statusA] - statusPriority[statusB];
        }

        // For upcoming events, sort by start time
        if (statusA === "upcoming") {
          const timeA = a.startTime
            ? new Date(a.startTime).getTime()
            : Infinity;
          const timeB = b.startTime
            ? new Date(b.startTime).getTime()
            : Infinity;
          return timeA - timeB;
        }

        // For ongoing events, prioritize those ending sooner
        if (statusA === "ongoing") {
          const timeA = a.endTime ? new Date(a.endTime).getTime() : Infinity;
          const timeB = b.endTime ? new Date(b.endTime).getTime() : Infinity;
          return timeA - timeB;
        }

        // For ended events, most recent first
        if (statusA === "ended") {
          const timeA = a.endTime
            ? new Date(a.endTime).getTime()
            : a.startTime
            ? new Date(a.startTime).getTime()
            : -Infinity;
          const timeB = b.endTime
            ? new Date(b.endTime).getTime()
            : b.startTime
            ? new Date(b.startTime).getTime()
            : -Infinity;
          return timeB - timeA;
        }

        // For unknown status, sort by name
        return a.name.localeCompare(b.name);
      });

      return sortedConferences;
    }),
});
