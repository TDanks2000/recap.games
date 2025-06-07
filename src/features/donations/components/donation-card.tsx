"use client";

import { formatDistance } from "date-fns";
import { motion } from "framer-motion";
import { useMemo } from "react";
import type { RouterOutputs } from "@/trpc/react";

type Donation = RouterOutputs["donations"]["listAll"][number];

// Framer Motion variants for a cleaner animation definition
const cardVariants = {
	rest: {
		// Corresponds to Tailwind's default shadow
		boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
	},
	hover: {
		// Corresponds to Tailwind's shadow-lg
		boxShadow:
			"0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
	},
};

const backgroundVariants = {
	rest: { opacity: 0 },
	hover: { opacity: 1 },
};

export default function DonationCard({ donation }: { donation: Donation }) {
	// Memoize expensive calculations to avoid re-running on every render
	const formattedAmount = useMemo(() => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: donation.currency.toUpperCase(),
		}).format(donation.amountInCents / 100);
	}, [donation.currency, donation.amountInCents]);

	const timeAgo = useMemo(() => {
		// Ensure the date is valid before formatting
		if (!donation.donatedAt) return null;
		return formatDistance(new Date(donation.donatedAt), new Date(), {
			addSuffix: true,
		});
	}, [donation.donatedAt]);

	return (
		<motion.div
			className="relative overflow-hidden rounded-xl border bg-card p-6 text-card-foreground"
			variants={cardVariants}
			initial="rest"
			whileHover="hover"
			animate="rest"
		>
			<motion.div
				className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"
				variants={backgroundVariants}
				transition={{ duration: 0.3, ease: "easeInOut" }}
			/>
			<div className="relative space-y-4">
				<div className="flex items-center justify-between gap-4">
					<h3 className="font-semibold text-primary text-xl">
						{donation.donatorName}
					</h3>
					<span className="font-bold text-2xl">{formattedAmount}</span>
				</div>

				{donation.donatorMessage && (
					<blockquote className="border-l-2 pl-4 text-muted-foreground italic">
						"{donation.donatorMessage}"
					</blockquote>
				)}
				<div className="flex justify-between text-muted-foreground text-xs">
					<span>
						via{" "}
						<span className="font-medium capitalize">{donation.provider}</span>
					</span>
					{/* Use the more user-friendly "time ago" format */}
					<span>{timeAgo}</span>
				</div>
			</div>
		</motion.div>
	);
}
