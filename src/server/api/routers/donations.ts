// src/server/api/routers/donations.ts

import { desc } from "drizzle-orm";
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
