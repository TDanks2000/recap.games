// src/server/api/routers/donations.ts

import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { donations } from "@/server/db/schema";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const donationsRouter = createTRPCRouter({
	/**
	 * Gets all donations for the public donation wall.
	 * @returns List of donations sorted by most recent first
	 */
	listAll: publicProcedure.query(async ({ ctx }) => {
		const allDonations = await ctx.db
			.select({
				id: donations.id,
				// Only get what we need to show on the donation wall
				donatorName: donations.donatorName,
				donatorMessage: donations.donatorMessage,
				amountInCents: donations.amountInCents,
				currency: donations.currency,
				donatedAt: donations.donatedAt,
				provider: donations.provider,
			})
			.from(donations)
			.orderBy(desc(donations.donatedAt));

		return allDonations;
	}),

	/**
	 * Admin: Get all donations with full details for management.
	 */
	getAllAdmin: adminProcedure.query(async ({ ctx }) => {
		const all = await ctx.db
			.select()
			.from(donations)
			.orderBy(desc(donations.donatedAt));
		return all;
	}),

	/**
	 * Admin: Update a donation by id.
	 */
	update: adminProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				donatorName: z.string().min(1).optional(),
				donatorMessage: z.string().optional().nullable(),
				amountInCents: z.number().int().positive().optional(),
				currency: z.string().min(1).optional(),
				donatedAt: z.date().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;
			const updated = await ctx.db
				.update(donations)
				.set({
					...data,
					// drizzle sqlite expects undefined to skip columns
					donatorName: data.donatorName ?? undefined,
					donatorMessage: data.donatorMessage ?? undefined,
					amountInCents: data.amountInCents ?? undefined,
					currency: data.currency ?? undefined,
					donatedAt: data.donatedAt ?? undefined,
				})
				.where(eq(donations.id, id))
				.returning();
			return updated[0];
		}),

	/**
	 * Admin: Delete a donation by id.
	 */
	delete: adminProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(donations).where(eq(donations.id, input.id));
			return { success: true } as const;
		}),

	/**
	 * Admin dashboard stats for donations.
	 * @returns Stats including total amounts, top supporters, and recent activity
	 */
	getAnalytics: adminProcedure.query(async ({ ctx }) => {
		// Get all donation data for calculations
		const allDonations = await ctx.db.query.donations.findMany();

		// Group total amounts by currency
		const totalAmountPerCurrency = allDonations.reduce(
			(acc, donation) => {
				const { currency, amountInCents } = donation;
				if (!acc[currency]) {
					acc[currency] = 0;
				}
				acc[currency] += amountInCents;
				return acc;
			},
			{} as Record<string, number>,
		);

		// Calculate total donations per person
		const donatorTotals = allDonations.reduce(
			(acc, donation) => {
				const { donatorName, currency, amountInCents } = donation;
				if (!acc[donatorName]) {
					acc[donatorName] = { name: donatorName, total: {} };
				}
				if (!acc[donatorName].total[currency]) {
					acc[donatorName].total[currency] = 0;
				}
				acc[donatorName].total[currency] += amountInCents;
				return acc;
			},
			{} as Record<string, { name: string; total: Record<string, number> }>,
		);

		// Get our top 5 supporters
		const topDonators = Object.values(donatorTotals)
			.sort((a, b) => {
				const maxA = Math.max(...Object.values(a.total));
				const maxB = Math.max(...Object.values(b.total));
				return maxB - maxA;
			})
			.slice(0, 5);

		// Get the 5 most recent donations
		const recentDonations = allDonations
			.sort((a, b) => b.donatedAt.getTime() - a.donatedAt.getTime())
			.slice(0, 5);

		return {
			totalDonations: allDonations.length,
			totalAmountPerCurrency,
			topDonators,
			recentDonations,
		};
	}),
});
