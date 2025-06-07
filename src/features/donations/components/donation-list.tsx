"use client";

import { motion } from "framer-motion";
import DonationsListSkeleton from "@/components/skeletons/donation-list-skeleton";
import { api } from "@/trpc/react";
import DonationCard from "./donation-card";
import DonationsHeader from "./donation-header";

export default function DonationsList() {
	const {
		data: donations,
		isLoading,
		error,
	} = api.donations.listAll.useQuery();

	return (
		<div className="w-full space-y-16">
			<DonationsHeader />

			<div>
				{isLoading && <DonationsListSkeleton />}

				{error && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive"
					>
						<p>Error loading donations: {error.message}</p>
					</motion.div>
				)}

				{!isLoading && !error && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<h2 className="mb-12 text-center font-bold text-4xl">Recent Supporters</h2>
						{donations?.length === 0 ? (
							<div className="rounded-lg border bg-muted/50 p-12 text-center">
								<p className="text-muted-foreground text-xl">
									No donations yet. Be the first to support this project!
								</p>
							</div>
						) : (
							<motion.div
								className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
								initial="hidden"
								animate="visible"
								variants={{
									visible: {
										transition: {
											staggerChildren: 0.1,
										},
									},
								}}
							>
								{donations?.map((donation) => (
									<motion.div
										key={donation.id}
										variants={{
											hidden: { opacity: 0, y: 20 },
											visible: { opacity: 1, y: 0 },
										}}
									>
										<DonationCard donation={donation} />
									</motion.div>
								))}
							</motion.div>
						)}
					</motion.div>
				)}
			</div>
		</div>
	);
}
